import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { Heart, Home, Layers, PlaySquare, User } from 'lucide-react';

type MainNavKey = 'home' | 'shorts' | 'categories' | 'favorites' | 'profile';

type NavItem = {
  key: MainNavKey;
  href: Route;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/home' as Route, label: 'Главная', icon: Home },
  { key: 'shorts', href: '/shorts' as Route, label: 'Shorts', icon: PlaySquare },
  { key: 'categories', href: '/categories' as Route, label: 'Разделы', icon: Layers },
  { key: 'favorites', href: '/favorites' as Route, label: 'Избранное', icon: Heart },
  { key: 'profile', href: '/profile' as Route, label: 'Профиль', icon: User }
];

export function MainNavigation({ active }: { active: MainNavKey }) {
  return (
    <>
      <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[220px] border-r border-border bg-card px-4 py-5 lg:block">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-xl px-3 text-[16px] font-semibold transition hover:bg-muted ${
                  isActive ? 'text-primary' : 'text-primary/70'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 px-4 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center ${isActive ? 'text-primary' : 'text-[#8EC7E6]'}`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[13px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}