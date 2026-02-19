import type { Route } from 'next';
import Link from 'next/link';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VideoCard } from '@/components/video/video-card';

export default async function FavoritesPage() {
  const user = await getCurrentUserFromSession();
  const activeChildId = user ? await getActiveChildIdForUser(user.id) : null;
  const child =
    user && activeChildId
      ? await prisma.childProfile.findFirst({
          where: { userId: user.id, id: activeChildId },
          select: { name: true }
        })
      : null;

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();

  const favorites = user
    ? await prisma.favorite.findMany({
        where: { userId: user.id, childId: activeChildId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          video: {
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
          }
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
          <h1 className="text-[40px] font-extrabold leading-none tracking-[0.03em] text-primary lg:text-[36px]">Избранное</h1>
          <Link
            href={'/parent/profiles' as Route}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4619A] text-[30px] font-bold text-white"
            aria-label="Профили"
          >
            {profileLetter}
          </Link>
        </div>
      </header>

      <main className="pb-24 px-5 py-5 pt-[88px] lg:ml-[220px] lg:px-6 lg:pb-8">
        <div className="mx-auto w-full max-w-6xl">
          {!user ? (
            <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
              Войдите в аккаунт, чтобы сохранять и смотреть избранные видео.
            </div>
          ) : favorites.length ? (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {favorites.map((item) => (
                <VideoCard key={item.id} video={item.video} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
              Вы пока ничего не добавили в избранное.
            </div>
          )}
        </div>
      </main>

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
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary transition hover:bg-muted"
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

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2">
          <Link href={'/home' as Route} className="flex flex-col items-center text-[#8EC7E6]">
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
          <Link href={'/favorites' as Route} className="flex flex-col items-center text-primary">
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
