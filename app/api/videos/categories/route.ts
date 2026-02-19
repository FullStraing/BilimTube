import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const grouped = await prisma.video.groupBy({
    by: ['category'],
    where: { isPublished: true },
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
