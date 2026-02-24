import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  createSessionExpiry,
  createSessionToken,
  normalizeEmail,
  normalizePhone,
  setSessionCookie
} from '@/lib/auth';
import { setLocaleCookie } from '@/lib/i18n/server';

const loginPayloadSchema = z.object({
  method: z.enum(['email', 'phone']),
  identifier: z.string().min(1),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = loginPayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'РќРµРІР°Р»РёРґРЅС‹Рµ РґР°РЅРЅС‹Рµ' }, { status: 400 });
    }

    const { method, identifier, password } = parsed.data;
    const email = method === 'email' ? normalizeEmail(identifier) : null;
    const phone = method === 'phone' ? normalizePhone(identifier) : null;

    const user = await prisma.user.findFirst({
      where: {
        OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(Boolean) as Array<
          | { email: string }
          | { phone: string }
        >
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'РђРєРєР°СѓРЅС‚ РЅРµ РЅР°Р№РґРµРЅ' }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Р­С‚РѕС‚ Р°РєРєР°СѓРЅС‚ СЃРѕР·РґР°РЅ С‡РµСЂРµР· Google. Р’РѕР№РґРёС‚Рµ С‡РµСЂРµР· Google.' }, { status: 400 });
    }

    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'РќРµРІРµСЂРЅС‹Р№ РїР°СЂРѕР»СЊ' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР°' }, { status: 500 });
  }
}

