import type { Route } from 'next';
import Link from 'next/link';
import { Heart, Home, Layers, PlaySquare, Search, User } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HomeFeed } from '@/features/videos/home-feed';

export default async function HomePage() {
  const user = await getCurrentUserFromSession();
  const child = user
    ? await prisma.childProfile.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
        select: { name: true }
      })
    : null;

  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();
  const helloName = child?.name ?? 'друг';

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <span className="text-[40px] font-extrabold leading-none tracking-[0.03em] text-primary">BILIMTUBE</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-primary transition hover:brightness-95"
            aria-label="Поиск"
          >
            <Search className="h-6 w-6" />
          </button>
          <Link
            href={'/parent/profiles' as Route}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4619A] text-[30px] font-bold text-white"
            aria-label="Профили"
          >
            {profileLetter}
          </Link>
        </div>
      </header>

      <main className="space-y-4 px-5 py-5">
        <h1 className="text-[48px] font-bold leading-tight text-primary">Привет, {helloName}! 👋</h1>
        <HomeFeed />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
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
