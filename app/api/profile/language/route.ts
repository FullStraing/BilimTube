import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserFromSession } from '@/lib/auth';
import { LOCALES, isLocale } from '@/lib/i18n/messages';
import { setLocaleCookie } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({
  locale: z.enum(LOCALES)
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const locale = parsed.data.locale;
  const user = await getCurrentUserFromSession();

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { language: locale }
    });
  }

  if (!isLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  await setLocaleCookie(locale);
  return NextResponse.json({ ok: true, locale });
}

