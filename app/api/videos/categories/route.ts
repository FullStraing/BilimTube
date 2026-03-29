import type { Prisma, VideoContentType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { getLocaleFromCookie } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { buildVideoLanguageWhere } from '@/lib/video-language';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);
  const contentTypeParam = url.searchParams.get('contentType');
  const contentType = contentTypeParam === 'SHORT' || contentTypeParam === 'LONG' ? (contentTypeParam as VideoContentType) : null;

  const grouped = await prisma.video.groupBy({
    by: ['category'],
    where: {
      AND: [
        { isPublished: true },
        ...(contentType ? ([{ contentType }] satisfies Prisma.VideoWhereInput[]) : []),
        buildVideoLanguageWhere(locale),
        ...policyClauses
      ]
    } satisfies Prisma.VideoWhereInput,
    _count: { _all: true },
    orderBy: { category: 'asc' }
  });

  return NextResponse.json(
    grouped.map((item) => ({
      name: item.category,
      count: item._count._all
    }))
  );
}
