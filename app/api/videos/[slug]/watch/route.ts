import { NextResponse } from 'next/server';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ ok: true });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({ ok: true });
  }

  const { slug } = await params;

  const video = await prisma.video.findFirst({
    where: { slug, isPublished: true },
    select: { id: true }
  });

  if (!video) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

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
