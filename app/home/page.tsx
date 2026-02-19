import type { Route } from 'next';
import Link from 'next/link';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HomeFeed } from '@/features/videos/home-feed';
import { toTitleCase } from '@/lib/text';
import { HomeIntroSplash } from '@/components/home/home-intro-splash';

export default async function HomePage() {
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
  const helloName = child?.name ? toTitleCase(child.name) : 'друг';

  return (
    <div className="min-h-screen bg-background">
      <HomeIntroSplash />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
          <span className="text-[36px] font-extrabold leading-none tracking-[0.03em] text-primary sm:text-[40px]">
            BILIMTUBE
          </span>

          <div className="flex items-center gap-3">
            <Link
              href={'/parent/profiles' as Route}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4619A] text-[30px] font-bold text-white"
              aria-label="Профили"
            >
              {profileLetter}
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-24 pt-[88px] lg:pb-8">
        <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[220px] border-r border-border bg-card px-4 py-5 lg:block">
          <nav className="space-y-1">
            <Link
              href={'/home' as Route}
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary transition hover:bg-muted"
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
          <h1 className="mb-4 text-[44px] font-bold leading-tight text-primary lg:mb-5 lg:text-[52px]">Привет, {helloName}! 👋</h1>
          <HomeFeed />
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
