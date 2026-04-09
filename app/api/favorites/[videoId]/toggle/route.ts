import { NextResponse } from 'next/server';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
  }
  const activeChildId = await getActiveChildIdForUser(user.id);
  if (!activeChildId) {
    return NextResponse.json({
      error:
        locale === 'en'
          ? 'Create or select a child profile first'
          : locale === 'ky'
            ? 'Адегенде бала профилин түзүңүз же тандаңыз'
            : 'Сначала создайте или выберите профиль ребенка'
    }, { status: 409 });
  }

  const { videoId } = await params;

  const video = await prisma.video.findFirst({
    where: { id: videoId, isPublished: true },
    select: { id: true }
  });

  if (!video) {
    return NextResponse.json({ error: translate(locale, 'common.videoNotFound') }, { status: 404 });
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
