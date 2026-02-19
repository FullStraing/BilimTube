import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromSession } from '@/lib/auth';
import { toTitleCase } from '@/lib/text';

const payloadSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(4).max(13),
  avatarColor: z.string().min(1),
  interests: z.array(z.string()).min(1)
});

export async function POST(req: Request) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const childrenCount = await prisma.childProfile.count({ where: { userId: user.id } });
  if (childrenCount >= 5) {
    return NextResponse.json({ error: 'Максимум 5 профилей детей на аккаунт' }, { status: 409 });
  }

  const child = await prisma.childProfile.create({
    data: {
      ...parsed.data,
      name: toTitleCase(parsed.data.name),
      userId: user.id
    }
  });

  return NextResponse.json(child);
}
