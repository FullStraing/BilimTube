import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma, hasLocalDatabaseInProduction } from '@/lib/prisma';
import { createSessionExpiry, createSessionToken, setSessionCookie } from '@/lib/auth';
import { exchangeGoogleCode, fetchGoogleUserInfo } from '@/lib/google-oauth';
import { setLocaleCookie } from '@/lib/i18n/server';

const GOOGLE_STATE_COOKIE = 'google_oauth_state';

function getOauthErrorCode(error: unknown) {
  if (hasLocalDatabaseInProduction()) {
    return 'db_unavailable';
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return 'db_unavailable';
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return 'db_unavailable';
  }

  const message = error instanceof Error ? error.message : String(error);
  if (/connect|database|postgres|prisma|localhost|127\.0\.0\.1/i.test(message)) {
    return 'db_unavailable';
  }

  return 'failed';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieStore = await cookies();
  const cookieState = cookieStore.get(GOOGLE_STATE_COOKIE)?.value;
  cookieStore.set(GOOGLE_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });

  if (!code || !state || !cookieState) {
    return NextResponse.redirect(new URL('/auth/login?oauth=invalid_state', req.url));
  }

  const [receivedNonce] = state.split(':');
  if (!receivedNonce || receivedNonce !== cookieState) {
    return NextResponse.redirect(new URL('/auth/login?oauth=invalid_state', req.url));
  }

  try {
    if (hasLocalDatabaseInProduction()) {
      throw new Error('Production DATABASE_URL points to localhost');
    }

    const token = await exchangeGoogleCode(req, code);
    const profile = await fetchGoogleUserInfo(token.access_token);

    if (!profile.email || !profile.email_verified) {
      return NextResponse.redirect(new URL('/auth/login?oauth=email_required', req.url));
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.sub }, { email: profile.email.toLowerCase() }]
      }
    });

    const normalizedEmail = profile.email.toLowerCase();
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          googleId: profile.sub,
          passwordHash: null,
          accountType: 'self',
          authMethod: 'google',
          language: 'ru'
        }
      });
      isNewUser = true;
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email ?? normalizedEmail,
          googleId: user.googleId ?? profile.sub
        }
      });
    }

    const sessionToken = createSessionToken();
    const expiresAt = createSessionExpiry();

    await prisma.session.create({
      data: {
        token: sessionToken,
        expiresAt,
        userId: user.id
      }
    });

    await setSessionCookie(sessionToken, expiresAt);
    await setLocaleCookie(user.language);

    const childrenCount = await prisma.childProfile.count({ where: { userId: user.id } });
    const destination = isNewUser || childrenCount === 0 ? '/child/create' : '/home';

    return NextResponse.redirect(new URL(destination, req.url));
  } catch (error) {
    console.error('Google OAuth callback failed', error);
    return NextResponse.redirect(new URL(`/auth/login?oauth=${getOauthErrorCode(error)}`, req.url));
  }
}
