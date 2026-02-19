import type { Route } from 'next';
import Link from 'next/link';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';

export default function ShortsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center px-4 sm:px-5 lg:px-6">
          <h1 className="text-[40px] font-extrabold leading-none tracking-[0.03em] text-primary lg:text-[36px]">Shorts</h1>
        </div>
      </header>

      <main className="space-y-4 px-5 py-5 pt-[88px] lg:ml-[220px] lg:px-6">
        <div className="rounded-[22px] border border-border bg-card p-5 text-[17px] text-primary/85 shadow-card">
          Лента коротких образовательных видео будет здесь.
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
            className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary transition hover:bg-muted"
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

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2">
          <Link href={'/home' as Route} className="flex flex-col items-center text-[#8EC7E6]">
            <Home className="h-6 w-6" />
            <span className="text-[13px] font-semibold">Главная</span>
          </Link>
          <Link href={'/shorts' as Route} className="flex flex-col items-center text-primary">
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
