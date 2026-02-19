import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ScrollText
} from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { prisma } from '@/lib/prisma';
import { formatDuration, formatViews } from '@/lib/video-format';
import { VideoActions } from '@/components/video/video-actions';
import { WatchTracker } from '@/components/video/watch-tracker';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';

export default async function VideoPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();
  const activeChildId = user ? await getActiveChildIdForUser(user.id) : null;
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const child = user
    ? await prisma.childProfile.findFirst({
        where: { userId: user.id, ...(activeChildId ? { id: activeChildId } : {}) },
        orderBy: { createdAt: 'asc' },
        select: { name: true }
      })
    : null;

  const video = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true }, ...policyClauses]
    },
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
      AND: [
        { isPublished: true, id: { not: video.id } },
        ...policyClauses,
        { OR: [{ category: video.category }, { ageGroup: video.ageGroup }] }
      ]
    },
    take: 8,
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
  if (user && activeChildId) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_childId_videoId: {
          userId: user.id,
          childId: activeChildId,
          videoId: video.id
        }
      },
      select: { id: true }
    });
    isFavorite = Boolean(favorite);
  }

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <WatchTracker slug={video.slug} />
      <PageHeader
        center={<span className="text-[36px] font-extrabold leading-none tracking-[0.03em] text-primary sm:text-[40px]">BILIMTUBE</span>}
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="pb-24 pt-[88px] lg:pb-8">
        <MainNavigation active="home" />

        <section className="px-4 sm:px-5 lg:ml-[220px] lg:px-6">
          <div className="mx-auto w-full max-w-[1400px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[22px] bg-black">
                <video
                  autoPlay
                  playsInline
                  preload="metadata"
                  controls
                  poster={video.thumbnailUrl}
                  className="aspect-video w-full object-cover"
                >
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

              <div className="rounded-[22px] border border-border bg-card p-4 shadow-card lg:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-[38px] font-bold leading-tight text-primary lg:text-[44px]">{video.title}</h1>
                    <p className="text-[20px] text-primary/90">{video.category}</p>
                    <p className="text-[18px] text-primary/80">{formatViews(video.viewsCount)}</p>
                  </div>
                  <VideoActions videoId={video.id} videoSlug={video.slug} initialIsFavorite={isFavorite} />
                </div>

                <article className="mt-4 rounded-[20px] border-2 border-[#5FAEE3] bg-secondary p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EAF6FF] text-primary">
                      <ScrollText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[30px] font-bold leading-none text-primary lg:text-[34px]">Пройди тест по видео!</p>
                      <p className="mt-1 text-[19px] text-primary/85">Проверь свои знания</p>
                    </div>
                  </div>
                  <Link
                    href={`/video/${video.slug}/quiz` as Route}
                    className="mt-4 flex h-14 w-full items-center justify-center rounded-[18px] bg-primary text-[30px] font-bold text-white transition hover:brightness-110"
                  >
                    Начать тест
                  </Link>
                </article>

                <p className="mt-4 text-[20px] leading-relaxed text-primary/90">{video.description}</p>
              </div>
            </div>

            <aside className="mt-5 space-y-3 lg:mt-0">
              <h2 className="text-[34px] font-bold text-primary lg:text-[30px]">Похожие видео</h2>
              {similar.length ? (
                similar.map((item) => (
                  <Link
                    key={item.id}
                    href={`/video/${item.slug}` as Route}
                    className="flex gap-3 rounded-[16px] border border-border bg-card p-3 shadow-card transition hover:brightness-[0.99]"
                  >
                    <div className="relative h-[96px] w-[140px] shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" sizes="160px" />
                      <div className="absolute right-1 top-1 rounded-full bg-[#0AC95E] px-2 py-0.5 text-[12px] font-bold text-white">
                        {item.ageGroup}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[20px] font-bold leading-tight text-primary">{item.title}</p>
                      <p className="mt-1 text-[16px] text-primary/85">{item.category}</p>
                      <p className="text-[15px] text-primary/75">
                        {formatDuration(item.durationSec)} • {formatViews(item.viewsCount)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[18px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
                  Пока похожих видео нет.
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
