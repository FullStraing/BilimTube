import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  createSessionExpiry,
  createSessionToken,
  normalizeEmail,
  normalizePhone,
  setSessionCookie
} from '@/lib/auth';
import { getLocaleFromCookie, setLocaleCookie, translate } from '@/lib/i18n/server';

const registerPayloadSchema = z.object({
  method: z.enum(['email', 'phone']),
  identifier: z.string().min(1),
  password: z.string().min(6),
  accountType: z.enum(['self', 'family'])
});

export async function POST(req: Request) {
  const locale = await getLocaleFromCookie();

  try {
    const json = await req.json();
    const parsed = registerPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: translate(locale, 'common.invalidData') }, { status: 400 });
    }

    const { method, identifier, password, accountType } = parsed.data;
    const email = method === 'email' ? normalizeEmail(identifier) : null;
    const phone = method === 'phone' ? normalizePhone(identifier) : null;

    if (method === 'email' && !z.string().email().safeParse(email).success) {
      return NextResponse.json({ error: translate(locale, 'validation.auth.email') }, { status: 400 });
    }

    if (method === 'phone' && (!phone || phone.length < 8)) {
      return NextResponse.json({ error: translate(locale, 'validation.auth.phone') }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(Boolean) as Array<
          | { email: string }
          | { phone: string }
        >
      }
    });

    if (existingUser) {
      return NextResponse.json({
        error: locale === 'en' ? 'Account already exists' : locale === 'ky' ? 'Аккаунт мурунтан эле бар' : 'Аккаунт уже существует'
      }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        accountType,
        authMethod: method,
        language: locale
      }
    });

    const token = createSessionToken();
    const expiresAt = createSessionExpiry();

    await prisma.session.create({
      data: {
        token,
        expiresAt,
        userId: user.id
      }
    });

    await setSessionCookie(token, expiresAt);
    await setLocaleCookie(user.language);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      authMethod: user.authMethod,
      language: user.language
    });
  } catch {
    return NextResponse.json({ error: translate(locale, 'common.serverError') }, { status: 500 });
  }
}
