'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { useLocale } from '@/components/i18n/locale-provider';
import { useToast } from '@/components/ui/use-toast';
import { translate } from '@/lib/i18n/messages';

export function AnalyticsAccessForm() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password.trim()) return;

    setIsPending(true);

    try {
      const response = await fetch('/api/survey/analytics-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? translate(locale, 'survey.analyticsWrongPassword'));
      }

      router.refresh();
    } catch (error) {
      toast({
        title: translate(locale, 'quiz.errorTitle'),
        description: error instanceof Error ? error.message : translate(locale, 'survey.analyticsWrongPassword')
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-secondary text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-[24px] font-bold text-primary">{translate(locale, 'survey.analyticsLockedTitle')}</h2>
          <p className="mt-1 text-[15px] text-primary/75">{translate(locale, 'survey.analyticsLockedDescription')}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label className="text-[15px] font-semibold text-primary">{translate(locale, 'survey.analyticsPassword')}</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={translate(locale, 'survey.analyticsPasswordPlaceholder')}
          className="h-12 w-full rounded-[16px] border border-border bg-background px-4 text-[16px] text-primary outline-none placeholder:text-primary/45 focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !password.trim()}
        className="mt-5 inline-flex h-12 items-center justify-center rounded-[16px] bg-primary px-5 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? translate(locale, 'survey.analyticsUnlocking') : translate(locale, 'survey.analyticsUnlock')}
      </button>
    </form>
  );
}
