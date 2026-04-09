'use client';

import { useMemo, useState } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLocale } from '@/components/i18n/locale-provider';
import { localizeCategoryName } from '@/lib/categories';
import { translate } from '@/lib/i18n/messages';
import { childProfileSchema, type ChildProfileValues } from './schema';

const colorOptions = ['#FF6B9C', '#55C4F1', '#FFB84D', '#A88BFF', '#38D39F', '#FF7A7A'];
const interestsOptions = [
  'Наука',
  'Математика',
  'Языки',
  'Искусство',
  'Музыка',
  'Спорт',
  'Мультфильмы',
  'Игры',
  'Творчество',
  'Природа'
];

export function ChildProfileForm() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const resolver = useMemo(() => zodResolver(childProfileSchema), []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ChildProfileValues>({
    resolver,
    defaultValues: {
      name: '',
      age: '' as unknown as number,
      avatarColor: selectedColor,
      interests: []
    }
  });

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) => {
      const next = prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
      setValue('interests', next, { shouldValidate: true });
      return next;
    });
  };

  const onSubmit = async (values: ChildProfileValues) => {
    const payload = {
      ...values,
      avatarColor: selectedColor,
      interests: selectedInterests
    };

    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      toast({ title: translate(locale, 'quiz.errorTitle'), description: translate(locale, 'child.sessionExpired') });
      router.push('/auth/login');
      return;
    }

    if (!res.ok) {
      const responsePayload = await res.json().catch(() => null);
      toast({
        title: translate(locale, 'quiz.errorTitle'),
        description: responsePayload?.error ?? translate(locale, 'child.saveFailed')
      });
      return;
    }

    toast({ title: translate(locale, 'child.createdTitle'), description: translate(locale, 'child.createdDescription') });
    router.push('/parent/profiles' as Route);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Link
          href={'/parent/profiles' as Route}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label={translate(locale, 'common.back')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-primary">{translate(locale, 'child.createTitle')}</h1>
          <p className="mt-2 text-sm text-primary/80">{translate(locale, 'child.createSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">{translate(locale, 'child.avatarColor')}</p>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-12 w-12 rounded-[16px] border-4 transition ${
                    selectedColor === color ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    setValue('avatarColor', color, { shouldValidate: true });
                  }}
                />
              ))}
            </div>
            {errors.avatarColor?.message ? (
              <p className="text-xs text-destructive">{errors.avatarColor.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">
              {translate(locale, 'child.name')} <span className="text-destructive">*</span>
            </label>
            <Input
              className="h-12 rounded-[16px] border-2 border-[#D0D8DF] text-sm"
              placeholder={translate(locale, 'child.namePlaceholder')}
              {...register('name')}
            />
            {errors.name?.message ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">
              {translate(locale, 'child.age')} <span className="text-destructive">*</span>
            </label>
            <Input
              className="h-12 rounded-[16px] border-2 border-[#D0D8DF] text-sm"
              placeholder={translate(locale, 'child.agePlaceholder')}
              {...register('age')}
            />
            {errors.age?.message ? <p className="text-xs text-destructive">{errors.age.message}</p> : null}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary">
              {translate(locale, 'child.interests')} <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {interestsOptions.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active ? 'bg-primary text-white' : 'bg-secondary text-primary hover:brightness-95'
                    }`}
                  >
                    {localizeCategoryName(interest, locale)}
                  </button>
                );
              })}
            </div>
            {errors.interests?.message ? (
              <p className="text-xs text-destructive">{errors.interests.message}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="h-14 w-full rounded-[20px] bg-primary text-white text-base font-semibold hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting ? translate(locale, 'child.saving') : translate(locale, 'child.create')}
          </Button>
        </form>
      </div>
    </div>
  );
}

