import type { Route } from 'next';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="container-page space-y-4 py-10">
      <h1 className="page-title">Профиль</h1>
      <p className="text-muted-foreground">Настройки аккаунта и история просмотра.</p>
      <Link
        href={'/home' as Route}
        className="inline-flex h-12 items-center justify-center rounded-[16px] bg-primary px-5 text-base font-semibold text-white transition hover:brightness-110"
      >
        На главную
      </Link>
    </div>
  );
}
