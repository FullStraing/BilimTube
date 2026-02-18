import type { Route } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play, ScrollText } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatViews } from '@/lib/video-format';
import { VideoActions } from '@/components/video/video-actions';
import { VideoCard } from '@/components/video/video-card';

export default async function VideoPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();

  const video = await prisma.video.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      ageGroup: true,
      thumbnailUrl: true,
      videoUrl: true,
      durationSec: true,
      viewsCount: true
    }
  });

  if (!video) {
    notFound();
  }

  const similar = await prisma.video.findMany({
    where: {
      isPublished: true,
      id: { not: video.id },
      OR: [{ category: video.category }, { ageGroup: video.ageGroup }]
    },
    take: 6,
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

  let isFavorite = false;
  if (user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: video.id
        }
      },
      select: { id: true }
    });
    isFavorite = Boolean(favorite);
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto w-full max-w-md">
        <div className="relative bg-black">
          <video controls poster={video.thumbnailUrl} className="h-[260px] w-full object-cover">
            <source src={video.videoUrl} type="video/mp4" />
          </video>
          <Link
            href={'/home' as Route}
            className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Назад"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>

        <section className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-[44px] font-bold leading-tight text-primary">{video.title}</h1>
              <p className="text-[22px] text-primary/90">{video.category}</p>
              <p className="text-[19px] text-primary/80">{formatViews(video.viewsCount)}</p>
            </div>
            <VideoActions videoId={video.id} videoSlug={video.slug} initialIsFavorite={isFavorite} />
          </div>

          <article className="rounded-[22px] border-2 border-[#5FAEE3] bg-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EAF6FF] text-primary">
                <ScrollText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[35px] font-bold leading-none text-primary">Пройди тест по видео!</p>
                <p className="mt-1 text-[20px] text-primary/85">Проверь свои знания</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 flex h-14 w-full items-center justify-center rounded-[18px] bg-primary text-[36px] font-bold text-white transition hover:brightness-110"
            >
              Начать тест
            </button>
          </article>

          <p className="text-[23px] leading-relaxed text-primary/90">{video.description}</p>

          <div className="space-y-3">
            <h2 className="text-[40px] font-bold text-primary">Похожие видео</h2>
            {similar.length ? (
              similar.map((item) => (
                <VideoCard key={item.id} video={item} />
              ))
            ) : (
              <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
                Пока похожих видео нет.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
