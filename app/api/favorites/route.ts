import { NextResponse } from 'next/server';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json([]);
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id, childId: activeChildId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      video: {
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
      }
    }
  });

  return NextResponse.json(favorites);
}

