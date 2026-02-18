import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({
  childId: z.string().min(1),
  dailyLimitMinutes: z.number().int().min(30).max(180),
  educationalOnly: z.boolean(),
  allowedAgeGroups: z
    .array(z.enum(['4-6', '7-9', '10-13']))
    .min(1)
    .max(3)
});

export async function POST(req: Request) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
  }

  const existingChild = await prisma.childProfile.findFirst({
    where: {
      id: parsed.data.childId,
      userId: user.id
    }
  });

  if (!existingChild) {
    return NextResponse.json({ error: 'Профиль ребенка не найден' }, { status: 404 });
  }

  const updated = await prisma.childProfile.update({
    where: { id: parsed.data.childId },
    data: {
      dailyLimitMinutes: parsed.data.dailyLimitMinutes,
      educationalOnly: parsed.data.educationalOnly,
      allowedAgeGroups: parsed.data.allowedAgeGroups
    },
    select: {
      id: true,
      dailyLimitMinutes: true,
      educationalOnly: true,
      allowedAgeGroups: true,
      updatedAt: true
    }
  });

  return NextResponse.json(updated);
}
