import { NextResponse } from 'next/server';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
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
