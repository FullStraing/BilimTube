import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-background px-5 py-5">
      <div className="mx-auto w-full max-w-xl space-y-4">
        <Link
          href={'/profile' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[34px] font-bold text-primary">Настройки</h1>
        <div className="rounded-[20px] border border-border bg-card p-4 text-[16px] text-primary/80 shadow-card">
          Основные настройки профиля будут добавлены на следующем этапе.
        </div>
      </div>
    </div>
  );
}

