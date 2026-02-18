import type { Route } from 'next';
import Link from 'next/link';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VideoCard } from '@/components/video/video-card';

export default async function FavoritesPage() {
  const user = await getCurrentUserFromSession();

  const favorites = user
    ? await prisma.favorite.findMany({
        where: { userId: user.id },
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
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border bg-card px-5 py-4">
        <h1 className="text-[40px] font-extrabold leading-none tracking-[0.03em] text-primary">Избранное</h1>
      </header>

      <main className="space-y-4 px-5 py-5">
        {!user ? (
          <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
            Войдите в аккаунт, чтобы сохранять и смотреть избранные видео.
          </div>
        ) : favorites.length ? (
          favorites.map((item) => <VideoCard key={item.id} video={item.video} />)
        ) : (
          <div className="rounded-[22px] border border-border bg-card p-4 text-[16px] text-primary/85 shadow-card">
            Вы пока ничего не добавили в избранное.
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
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
