'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import { cn } from '@/lib/utils';

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden border-b bg-background md:block">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          BilimTube
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-secondary',
                  active && 'bg-secondary text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="text-sm text-muted-foreground">Beta</div>
      </div>
    </header>
  );
}

