'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Locale } from '@/lib/i18n/messages';
import { translate } from '@/lib/i18n/messages';
import { useLocale } from '@/components/i18n/locale-provider';

const OPTIONS: Locale[] = ['ru', 'en', 'ky'];

export function LanguageForm({ initialLocale }: { initialLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const currentLocale = useLocale();

  const onSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale })
      });

      if (!response.ok) {
        toast({ title: translate(currentLocale, 'language.saveError') });
        return;
      }

      toast({ title: translate(locale, 'language.saved') });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={`w-full rounded-[16px] border px-4 py-3 text-left text-[16px] font-semibold transition ${
            option === locale ? 'border-primary bg-secondary text-primary' : 'border-border bg-card text-primary/80'
          }`}
          onClick={() => setLocale(option)}
        >
          {translate(currentLocale, `language.${option}`)}
        </button>
      ))}

      <Button
        type="button"
        className="h-12 w-full rounded-[16px] bg-primary text-white"
        disabled={loading}
        onClick={onSave}
      >
        {loading ? '...' : translate(currentLocale, 'language.save')}
      </Button>
    </div>
  );
}


