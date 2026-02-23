import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { prisma } from '@/lib/prisma';

const payloadSchema = z.object({
  watchedMs: z.number().int().min(0).max(60 * 60 * 1000).optional(),
  completed: z.boolean().optional()
});

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }

  const { slug } = await params;
  const policy = await getActiveChildPolicy(user.id);
  const policyClauses = buildVideoPolicyClauses(policy);

  const video = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true, contentType: 'SHORT' }, ...policyClauses]
    },
    select: { id: true }
  });

  if (!video) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  const watchedMs = parsed.data.watchedMs ?? 0;
  const completed = parsed.data.completed ?? false;

  await prisma.shortView.upsert({
    where: {
      userId_childId_videoId: {
        userId: user.id,
        childId: activeChildId,
        videoId: video.id
      }
    },
    update: {
      watchedMs: { increment: watchedMs },
      completed: completed ? true : undefined,
      viewedAt: new Date()
    },
    create: {
      userId: user.id,
      childId: activeChildId,
      videoId: video.id,
      watchedMs,
      completed,
      viewedAt: new Date()
    }
  });

  await prisma.watchHistory.upsert({
    where: {
      userId_childId_videoId: {
        userId: user.id,
        childId: activeChildId,
        videoId: video.id
      }
    },
    update: {
      watchedAt: new Date()
    },
    create: {
      userId: user.id,
      childId: activeChildId,
      videoId: video.id
    }
  });

  return NextResponse.json({ ok: true });
}
