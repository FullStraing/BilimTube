import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { getLocaleFromCookie } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { buildVideoLanguageWhere } from '@/lib/video-language';

export async function GET() {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const grouped = await prisma.video.groupBy({
    by: ['category'],
    where: {
      AND: [{ isPublished: true }, buildVideoLanguageWhere(locale), ...policyClauses]
    },
    _count: { _all: true },
    orderBy: { category: 'asc' }
  });

  return NextResponse.json(
    grouped.map((item) => ({
      name: item.category,
      count: item._count._all
    })),
  );
}

