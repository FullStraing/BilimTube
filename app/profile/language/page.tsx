import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { LanguageForm } from '@/components/profile/language-form';

export default async function ProfileLanguagePage() {
  const localeFromCookie = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const locale = user?.language ?? localeFromCookie;

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

        <h1 className="text-[34px] font-bold text-primary">{translate(locale, 'language.title')}</h1>
        <p className="text-[16px] text-primary/80">{translate(locale, 'language.subtitle')}</p>

        <LanguageForm initialLocale={locale} />
      </div>
    </div>
  );
}

