import Link from 'next/link';
import { Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-white px-5 py-4">
        <span className="text-lg font-extrabold tracking-[0.04em] text-primary">BILIMTUBE</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition hover:brightness-95"
            aria-label="Поиск"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#FF6B9C] text-white"
            aria-label="Профиль"
          >
            Ф
          </Link>
        </div>
      </header>
      <main className="px-5 py-6">
        <h1 className="text-xl font-semibold text-primary">Привет!</h1>
        <p className="mt-2 text-sm text-primary/70">Главная страница в разработке.</p>
        <div className="mt-6 h-40 rounded-[18px] border border-border bg-white" />
      </main>
    </div>
  );
}
