import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
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
