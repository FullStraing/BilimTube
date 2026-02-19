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
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
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
      return NextResponse.json({ error: 'Аккаунт не найден' }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'Этот аккаунт создан через Google. Войдите через Google.' }, { status: 400 });
    }

    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      authMethod: user.authMethod
    });
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
