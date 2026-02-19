import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromSession } from '@/lib/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 10), 1), 50);
  const q = url.searchParams.get('q')?.trim();
  const category = url.searchParams.get('category')?.trim();
  const ageGroup = url.searchParams.get('ageGroup')?.trim();

  const user = await getCurrentUserFromSession();

  const videos = await prisma.video.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(ageGroup ? { ageGroup } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { category: { contains: q, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      ageGroup: true,
      thumbnailUrl: true,
      durationSec: true,
      viewsCount: true
    }
  });

  if (!user) {
    return NextResponse.json(videos.map((video) => ({ ...video, isFavorite: false })));
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id, videoId: { in: videos.map((video) => video.id) } },
    select: { videoId: true }
  });

  const favoriteSet = new Set(favorites.map((fav) => fav.videoId));

  return NextResponse.json(
    videos.map((video) => ({
      ...video,
      isFavorite: favoriteSet.has(video.id)
    })),
  );
}
