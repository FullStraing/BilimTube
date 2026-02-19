import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();

  const video = await prisma.video.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      ageGroup: true,
      thumbnailUrl: true,
      videoUrl: true,
      durationSec: true,
      viewsCount: true
    }
  });

  if (!video) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  if (!user) {
    return NextResponse.json({ ...video, isFavorite: false });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({ ...video, isFavorite: false });
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_childId_videoId: {
        userId: user.id,
        childId: activeChildId,
        videoId: video.id
      }
    }
  });

  return NextResponse.json({ ...video, isFavorite: Boolean(favorite) });
}
