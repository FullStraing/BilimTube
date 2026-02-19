import type { Route } from 'next';
import Link from 'next/link';
import {
  Calculator,
  Gamepad2,
  Heart,
  Home,
  Languages,
  Layers,
  Leaf,
  Microscope,
  Music2,
  Palette,
  PlaySquare,
  Sparkles,
  Tv,
  User,
  Volleyball
} from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const CATEGORY_PRESET = [
  { name: 'Наука', Icon: Microscope },
  { name: 'Математика', Icon: Calculator },
  { name: 'Языки', Icon: Languages },
  { name: 'Искусство', Icon: Palette },
  { name: 'Музыка', Icon: Music2 },
  { name: 'Спорт', Icon: Volleyball },
  { name: 'Мультфильмы', Icon: Tv },
  { name: 'Игры', Icon: Gamepad2 },
  { name: 'Творчество', Icon: Sparkles },
  { name: 'Природа', Icon: Leaf }
] as const;

export default async function CategoriesPage() {
  const user = await getCurrentUserFromSession();
  const child = user
    ? await prisma.childProfile.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
        select: { name: true }
      })
    : null;
  const profileLetter = (child?.name?.trim()?.charAt(0) ?? 'M').toUpperCase();

  const grouped = await prisma.video.groupBy({
    by: ['category'],
    where: { isPublished: true },
    _count: { _all: true }
  });

  const countMap = new Map(grouped.map((item) => [item.category, item._count._all]));
  const knownNames = new Set<string>(CATEGORY_PRESET.map((item) => item.name));

  const categories = [
    ...CATEGORY_PRESET.map((item) => ({
      name: item.name,
      count: countMap.get(item.name) ?? 0,
      Icon: item.Icon
    })),
    ...grouped
      .filter((item) => !knownNames.has(item.category))
      .map((item) => ({
        name: item.category,
        count: item._count._all,
        Icon: Layers
      }))
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" />
            <h1 className="text-[42px] font-bold leading-none text-primary lg:text-[36px]">Разделы</h1>
          </div>
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
              className="flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold text-primary transition hover:bg-muted"
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

        <div className="px-5 lg:ml-[220px] lg:px-6">
          <p className="mb-4 text-[34px] text-primary/95 lg:text-[24px]">Выберите категорию видео</p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/search?category=${encodeURIComponent(category.name)}` as Route}
                className="rounded-[20px] border border-border bg-card px-4 py-5 text-center shadow-card transition hover:-translate-y-0.5 hover:brightness-[0.99]"
              >
                <category.Icon className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-3 text-[26px] font-bold leading-tight text-primary lg:text-[22px]">{category.name}</p>
                <p className="mt-1 text-[19px] text-primary/90 lg:text-[17px]">{category.count} видео</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

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
          <Link href={'/categories' as Route} className="flex flex-col items-center text-primary">
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
