import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';

const DEFAULT_TAKE = 5;
const MAX_TAKE = 12;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cursor = url.searchParams.get('cursor')?.trim() || undefined;
  const take = Math.min(Math.max(Number(url.searchParams.get('take') ?? DEFAULT_TAKE), 1), MAX_TAKE);

  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const where: Prisma.VideoWhereInput = {
    AND: [{ isPublished: true, contentType: 'SHORT' }, ...policyClauses]
  };

  const shorts = await prisma.video.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
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

  const hasMore = shorts.length > take;
  const items = hasMore ? shorts.slice(0, take) : shorts;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  if (!user || items.length === 0) {
    return NextResponse.json({
      items: items.map((item) => ({ ...item, isFavorite: false })),
      nextCursor
    });
  }

  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({
      items: items.map((item) => ({ ...item, isFavorite: false })),
      nextCursor
    });
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
      childId: activeChildId,
      videoId: { in: items.map((video) => video.id) }
    },
    select: { videoId: true }
  });

  const favoriteSet = new Set(favorites.map((fav) => fav.videoId));

  return NextResponse.json({
    items: items.map((video) => ({
      ...video,
      isFavorite: favoriteSet.has(video.id)
    })),
    nextCursor
  });
}
