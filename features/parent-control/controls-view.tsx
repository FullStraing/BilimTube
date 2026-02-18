'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock3, Eye, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ChildControlData = {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  dailyLimitMinutes: number;
  educationalOnly: boolean;
  allowedAgeGroups: string[];
};

type ParentControlsProps = {
  child: ChildControlData;
};

const limits = [30, 60, 120, 180] as const;

export function ParentControlsView({ child }: ParentControlsProps) {
  const { toast } = useToast();
  const [dailyLimit, setDailyLimit] = useState<number>(child.dailyLimitMinutes ?? 120);
  const [educationalOnly, setEducationalOnly] = useState<boolean>(child.educationalOnly ?? false);
  const [age4to6, setAge4to6] = useState<boolean>(child.allowedAgeGroups.includes('4-6'));
  const [age7to9, setAge7to9] = useState<boolean>(child.allowedAgeGroups.includes('7-9'));
  const [age10to13, setAge10to13] = useState<boolean>(child.allowedAgeGroups.includes('10-13'));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDailyLimit(child.dailyLimitMinutes ?? 120);
    setEducationalOnly(child.educationalOnly ?? false);
    setAge4to6(child.allowedAgeGroups.includes('4-6'));
    setAge7to9(child.allowedAgeGroups.includes('7-9'));
    setAge10to13(child.allowedAgeGroups.includes('10-13'));
  }, [child]);

  const handleSave = async () => {
    const allowedAgeGroups = [age4to6 ? '4-6' : null, age7to9 ? '7-9' : null, age10to13 ? '10-13' : null].filter(
      Boolean,
    ) as string[];

    if (!allowedAgeGroups.length) {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы одну возрастную категорию.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/parent/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          dailyLimitMinutes: dailyLimit,
          educationalOnly,
          allowedAgeGroups
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        toast({
          title: 'Ошибка сохранения',
          description: payload.error ?? 'Не удалось сохранить настройки.'
        });
        return;
      }

      toast({ title: 'Сохранено', description: 'Настройки родительского контроля обновлены.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header className="space-y-4">
          <Link
            href={'/parent/profiles' as Route}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
            aria-label="Назад"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>

          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-7 w-7 text-primary" />
            <div className="space-y-1">
              <h1 className="text-[46px] font-extrabold leading-[0.95] tracking-tight text-primary">Родительский контроль</h1>
              <p className="text-[18px] font-medium leading-tight text-primary/90">{child.name}: управление безопасностью</p>
            </div>
          </div>
        </header>

        <section className="rounded-[24px] border border-border bg-card px-4 py-4 shadow-card">
          <h2 className="mb-2 flex items-center gap-2 text-[32px] font-bold tracking-tight text-primary">
            <Clock3 className="h-6 w-6" /> Лимит времени
          </h2>
          <p className="mb-4 text-[18px] font-medium text-primary/90">Максимальное время просмотра в день</p>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div className="h-3 flex-1 rounded-full bg-[#D5D5D5]">
              <div
                className="h-full rounded-full bg-primary/90"
                style={{ width: `${Math.max(16, (dailyLimit / 180) * 100)}%` }}
              />
            </div>
            <p className="text-[28px] font-bold leading-none text-primary">{dailyLimit} мин</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {limits.map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => setDailyLimit(limit)}
                className={`rounded-full px-4 py-2 text-[16px] font-semibold leading-none transition ${
                  limit === dailyLimit ? 'bg-primary text-white' : 'bg-secondary text-primary hover:brightness-95'
                }`}
              >
                {limit} мин
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-border bg-card px-4 py-4 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 text-[32px] font-bold tracking-tight text-primary">
            <BookOpen className="h-6 w-6" /> Фильтр контента
          </h2>
          <label className="flex items-center justify-between rounded-[16px] bg-secondary px-4 py-3">
            <div>
              <p className="text-[20px] font-bold leading-none text-primary">Только обучающие видео</p>
              <p className="mt-1 text-[16px] font-medium text-primary/85">Скрыть развлекательный контент</p>
            </div>
            <input
              type="checkbox"
              checked={educationalOnly}
              onChange={(event) => setEducationalOnly(event.target.checked)}
              className="h-6 w-6"
            />
          </label>
        </section>

        <section className="rounded-[24px] border border-border bg-card px-4 py-4 shadow-card">
          <h2 className="mb-2 flex items-center gap-2 text-[32px] font-bold tracking-tight text-primary">
            <Eye className="h-6 w-6" /> Возрастные ограничения
          </h2>
          <p className="mb-3 text-[18px] font-medium text-primary/90">Выберите разрешенные возрастные категории</p>
          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-[16px] bg-secondary px-4 py-3">
              <span className="text-[20px] font-semibold leading-none text-primary">4-6 лет</span>
              <input
                type="checkbox"
                checked={age4to6}
                onChange={(event) => setAge4to6(event.target.checked)}
                className="h-6 w-6"
              />
            </label>
            <label className="flex items-center justify-between rounded-[16px] bg-secondary px-4 py-3">
              <span className="text-[20px] font-semibold leading-none text-primary">7-9 лет</span>
              <input
                type="checkbox"
                checked={age7to9}
                onChange={(event) => setAge7to9(event.target.checked)}
                className="h-6 w-6"
              />
            </label>
            <label className="flex items-center justify-between rounded-[16px] bg-secondary px-4 py-3">
              <span className="text-[20px] font-semibold leading-none text-primary">10-13 лет</span>
              <input
                type="checkbox"
                checked={age10to13}
                onChange={(event) => setAge10to13(event.target.checked)}
                className="h-6 w-6"
              />
            </label>
          </div>
        </section>

        <section className="space-y-3 pb-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-16 w-full items-center justify-center rounded-[20px] bg-primary text-center text-[18px] font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {isSaving ? 'Сохраняем...' : 'Сохранить настройки'}
          </button>
          <Link
            href={'/parent/profiles' as Route}
            className="block text-center text-[18px] font-semibold text-primary hover:underline"
          >
            Назад к профилям
          </Link>
        </section>
      </div>
    </div>
  );
}
