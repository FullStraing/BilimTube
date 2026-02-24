'use client';

import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';
import { useLocale } from '@/components/i18n/locale-provider';
import { translate } from '@/lib/i18n/messages';

type MainNavKey = 'home' | 'shorts' | 'categories' | 'favorites' | 'profile';

type NavItem = {
  key: MainNavKey;
  href: Route;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/home' as Route, icon: Home },
  { key: 'shorts', href: '/shorts' as Route, icon: PlaySquare },
  { key: 'categories', href: '/categories' as Route, icon: Layers },
  { key: 'favorites', href: '/favorites' as Route, icon: Heart },
  { key: 'profile', href: '/profile' as Route, icon: User }
];

const LABEL_KEYS: Record<MainNavKey, string> = {
  home: 'nav.home',
  shorts: 'nav.shorts',
  categories: 'nav.categories',
  favorites: 'nav.favorites',
  profile: 'nav.profile'
};

export function MainNavigation({ active }: { active: MainNavKey }) {
  const locale = useLocale();

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[220px] border-r border-border bg-card px-4 py-5 lg:block">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            const label = translate(locale, LABEL_KEYS[item.key]);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold transition hover:bg-muted ${
                  isActive ? 'text-primary' : 'text-primary/70'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            const label = translate(locale, LABEL_KEYS[item.key]);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex min-w-0 flex-col items-center ${isActive ? 'text-primary' : 'text-[#8EC7E6]'}`}
              >
                <Icon className="h-6 w-6" />
                <span className="max-w-full truncate text-[13px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}


