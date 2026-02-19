import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Home,
  Layers,
  PlaySquare,
  ScrollText,
  User
} from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDuration, formatViews } from '@/lib/video-format';
import { VideoActions } from '@/components/video/video-actions';

export default async function VideoPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUserFromSession();

  const child = user
    ? await prisma.childProfile.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
        select: { name: true }
      })
    : null;

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

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
          <span className="text-[36px] font-extrabold leading-none tracking-[0.03em] text-primary sm:text-[40px]">BILIMTUBE</span>
          <Link
            href={'/parent/profiles' as Route}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4619A] text-[30px] font-bold text-white"
            aria-label="Профили"
          >
            {profileLetter}
          </Link>
        </div>
      </header>

      <main className="pb-24 pt-[88px] lg:pb-8">
        <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[220px] border-r border-border bg-card px-4 py-5 lg:block">
          <nav className="space-y-1">
            <Link
              href={'/home' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
            >
              <Home className="h-5 w-5" />
              Главная
            </Link>
            <Link
              href={'/shorts' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
            >
              <PlaySquare className="h-5 w-5" />
              Shorts
            </Link>
            <Link
              href={'/categories' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
            >
              <Layers className="h-5 w-5" />
              Разделы
            </Link>
            <Link
              href={'/favorites' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
            >
              <Heart className="h-5 w-5" />
              Избранное
            </Link>
            <Link
              href={'/profile' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary/70 transition hover:bg-muted"
            >
              <User className="h-5 w-5" />
              Профиль
            </Link>
          </nav>
        </aside>

        <section className="px-4 sm:px-5 lg:ml-[220px] lg:px-6">
          <div className="mx-auto w-full max-w-[1400px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[22px] bg-black">
                <video
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
                  <button
                    type="button"
                    className="mt-4 flex h-14 w-full items-center justify-center rounded-[18px] bg-primary text-[30px] font-bold text-white transition hover:brightness-110"
                  >
                    Начать тест
                  </button>
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

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2">
          <Link href={'/home' as Route} className="flex flex-col items-center text-primary">
            <Home className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Главная</span>
          </Link>
          <Link href={'/shorts' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <PlaySquare className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Shorts</span>
          </Link>
          <Link href={'/categories' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Layers className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Разделы</span>
          </Link>
          <Link href={'/favorites' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Heart className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Избранное</span>
          </Link>
          <Link href={'/profile' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <User className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
