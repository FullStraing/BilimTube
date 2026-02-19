import { NextResponse } from 'next/server';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({ error: 'Сначала создайте или выберите профиль ребенка' }, { status: 409 });
  }

  const { videoId } = await params;

  const video = await prisma.video.findFirst({
    where: { id: videoId, isPublished: true },
    select: { id: true }
  });

  if (!video) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_childId_videoId: {
        userId: user.id,
        childId: activeChildId,
        videoId
      }
    }
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ isFavorite: false });
  }

  await prisma.favorite.create({
    data: {
      userId: user.id,
      childId: activeChildId,
      videoId
    }
  });

  return NextResponse.json({ isFavorite: true });
}
