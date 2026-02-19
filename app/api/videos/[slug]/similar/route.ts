import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const currentVideo = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true }, ...policyClauses]
    },
    select: { id: true, category: true, ageGroup: true }
  });

  if (!currentVideo) {
    return NextResponse.json({ error: 'Видео не найдено' }, { status: 404 });
  }

  const similar = await prisma.video.findMany({
    where: {
      AND: [
        { isPublished: true, id: { not: currentVideo.id } },
        ...policyClauses,
        { OR: [{ category: currentVideo.category }, { ageGroup: currentVideo.ageGroup }] }
      ]
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
