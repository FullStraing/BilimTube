import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromSession, setActiveChildCookie } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { toTitleCase } from '@/lib/text';

const payloadSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(4).max(13),
  avatarColor: z.string().min(1),
  interests: z.array(z.string()).min(1)
});

export async function POST(req: Request) {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: translate(locale, 'common.invalidData') }, { status: 400 });
  }

  const childrenCount = await prisma.childProfile.count({ where: { userId: user.id } });
  if (childrenCount >= 5) {
    return NextResponse.json({
      error:
        locale === 'en'
          ? 'Maximum 5 child profiles per account'
          : locale === 'ky'
            ? 'Бир аккаунтка эң көп 5 бала профили кошулат'
            : 'Максимум 5 профилей детей на аккаунт'
    }, { status: 409 });
  }

  const child = await prisma.childProfile.create({
    data: {
      ...parsed.data,
      name: toTitleCase(parsed.data.name),
      userId: user.id
    }
  });

  await setActiveChildCookie(child.id);

  return NextResponse.json(child);
}
