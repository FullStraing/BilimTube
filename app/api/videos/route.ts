import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 10), 1), 50);
  const q = url.searchParams.get('q')?.trim();
  const category = url.searchParams.get('category')?.trim();
  const ageGroup = url.searchParams.get('ageGroup')?.trim();

  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);
  const andClauses: Prisma.VideoWhereInput[] = [{ isPublished: true, contentType: 'LONG' }, ...policyClauses];

  if (category) andClauses.push({ category });
  if (ageGroup) andClauses.push({ ageGroup });
  if (q) {
    andClauses.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } }
      ]
    });
  }

  const videos = await prisma.video.findMany({
    where: {
      AND: andClauses
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
  const activeChildId = await getActiveChildIdForUser(user.id);

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
      childId: activeChildId,
      videoId: { in: videos.map((video) => video.id) }
    },
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
