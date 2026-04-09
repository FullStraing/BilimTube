'use client';

import { useLocale } from '@/components/i18n/locale-provider';
import { translate } from '@/lib/i18n/messages';

export function GoogleAuthButton({ mode }: { mode: 'login' | 'register' }) {
  const locale = useLocale();

  return (
    <a
      href={`/api/auth/google/start?mode=${mode}`}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border-2 border-[#D0D8DF] bg-white px-4 text-sm font-semibold text-primary transition hover:bg-slate-50"
    >
      <span
        aria-hidden
        className="grid h-6 w-6 place-items-center rounded-full border border-slate-300 bg-white text-[12px] font-bold text-slate-700"
      >
        G
      </span>
      {translate(locale, 'auth.googleContinue')}
    </a>
  );
}
