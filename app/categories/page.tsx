import type { Route } from 'next';
import Link from 'next/link';
import {
  Calculator,
  Gamepad2,
  Languages,
  Layers,
  Leaf,
  Microscope,
  Music2,
  Palette,
  Sparkles,
  Tv,
  Volleyball
} from 'lucide-react';
import { getActiveChildIdForUser, getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { prisma } from '@/lib/prisma';
import { MainNavigation } from '@/components/layout/main-navigation';
import { HeaderProfileLink, PageHeader } from '@/components/layout/page-header';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';

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
  const locale = await getLocaleFromCookie();
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

  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const grouped = await prisma.video.groupBy({
    by: ['category'],
    where: {
      AND: [{ isPublished: true }, ...policyClauses]
    },
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
      <PageHeader
        center={
          <div className="flex items-center gap-2 sm:gap-3">
            <Layers className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <h1 className="text-[28px] font-bold leading-none text-primary sm:text-[34px] lg:text-[36px]">{translate(locale, 'categories.title')}</h1>
          </div>
        }
        right={<HeaderProfileLink letter={profileLetter} />}
      />

      <main className="pb-24 pt-[88px] lg:pb-8">
        <MainNavigation active="categories" />

        <div className="px-4 sm:px-5 lg:ml-[220px] lg:px-6">
          <p className="mb-4 text-[22px] text-primary/95 sm:text-[28px] lg:text-[24px]">{translate(locale, 'categories.subtitle')}</p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/search?category=${encodeURIComponent(category.name)}` as Route}
                className="rounded-[20px] border border-border bg-card px-3 py-4 text-center shadow-card transition hover:-translate-y-0.5 hover:brightness-[0.99] sm:px-4 sm:py-5"
              >
                <category.Icon className="mx-auto h-10 w-10 text-primary sm:h-12 sm:w-12" />
                <p className="mt-3 break-words text-[18px] font-bold leading-tight text-primary sm:text-[24px] lg:text-[22px]">{category.name}</p>
                <p className="mt-1 text-[16px] text-primary/90 sm:text-[18px] lg:text-[17px]">
                  {translate(locale, 'categories.videoCount', { count: category.count })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

