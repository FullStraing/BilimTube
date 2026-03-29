import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

type PageHeaderProps = {
  left?: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  centerAlign?: 'left' | 'center';
};

export function PageHeader({ left, center, right, centerAlign = 'center' }: PageHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto grid h-[72px] w-full grid-cols-[48px_minmax(0,1fr)_48px] items-center gap-4 px-4 sm:px-5 lg:px-6">
        <div className="flex h-12 w-12 items-center justify-start">{left ?? <div className="h-12 w-12" aria-hidden />}</div>
        <div className={`min-w-0 flex-1 ${centerAlign === 'left' ? 'text-left' : 'text-center'}`}>{center}</div>
        <div className="flex h-12 w-12 items-center justify-end">{right ?? <div className="h-12 w-12" aria-hidden />}</div>
      </div>
    </header>
  );
}

export function HeaderBackLink({ href }: { href: Route }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
      aria-label="Назад"
    >
      <ArrowLeft className="h-6 w-6" />
    </Link>
  );
}

export function HeaderProfileLink({ letter }: { letter: string }) {
  return (
    <Link
      href={'/parent/profiles' as Route}
      className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4619A] text-[30px] font-bold text-white"
      aria-label="Профили"
    >
      {letter}
    </Link>
  );
}

