import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildGoogleAuthUrl, createGoogleOauthState } from '@/lib/google-oauth';

const GOOGLE_STATE_COOKIE = 'google_oauth_state';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') === 'register' ? 'register' : 'login';
    const nonce = createGoogleOauthState();
    const state = `${nonce}:${mode}`;

    const cookieStore = await cookies();
    cookieStore.set(GOOGLE_STATE_COOKIE, nonce, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 10 * 60
    });

    return NextResponse.redirect(buildGoogleAuthUrl(req, state));
  } catch {
    return NextResponse.redirect(new URL('/auth/login?oauth=google_unavailable', req.url));
  }
}
