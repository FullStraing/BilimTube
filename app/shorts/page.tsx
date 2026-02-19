import { PlaySquare } from 'lucide-react';
import { MainNavigation } from '@/components/layout/main-navigation';
import { PageHeader } from '@/components/layout/page-header';

export default function ShortsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <PageHeader
        center={
          <div className="flex items-center gap-3">
            <PlaySquare className="h-8 w-8 text-primary" />
            <h1 className="text-[48px] font-bold leading-none text-primary lg:text-[36px]">Shorts</h1>
          </div>
        }
      />

      <main className="space-y-4 px-5 py-5 pt-[88px] lg:px-6">
        <MainNavigation active="shorts" />
        <div className="rounded-[22px] border border-border bg-card p-5 text-[17px] text-primary/85 shadow-card lg:ml-[220px]">
          Лента коротких образовательных видео будет здесь.
        </div>
      </main>
    </div>
  );
}
