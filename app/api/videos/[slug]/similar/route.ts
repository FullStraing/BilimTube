import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const currentVideo = await prisma.video.findFirst({
    where: { slug, isPublished: true },
    select: { id: true, category: true, ageGroup: true }
  });

  if (!currentVideo) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  const similar = await prisma.video.findMany({
    where: {
      isPublished: true,
      id: { not: currentVideo.id },
      OR: [{ category: currentVideo.category }, { ageGroup: currentVideo.ageGroup }]
    },
    orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
    take: 10,
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      ageGroup: true,
      thumbnailUrl: true,
      durationSec: true,
      viewsCount: true
    }
  });

  return NextResponse.json(similar);
}
