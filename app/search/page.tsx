import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { VideoCard } from '@/components/video/video-card';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const videos = await prisma.video.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {})
    },
    orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
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
  });

  return (
    <div className="min-h-screen bg-background px-5 py-5 lg:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href={'/categories' as Route}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
            aria-label="Назад"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-[34px] font-bold leading-none text-primary lg:text-[38px]">
              {category ? `Категория: ${category}` : 'Поиск'}
            </h1>
            <p className="mt-1 text-[17px] text-primary/80">
              {videos.length} видео
            </p>
          </div>
        </div>

        {videos.length ? (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
            Видео в этой категории пока нет.
          </div>
        )}
      </div>
    </div>
  );
}
