'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
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
      toast({ title: 'Ошибка', description: 'Сессия истекла, войдите снова' });
      router.push('/auth/login');
      return;
    }

    if (!res.ok) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить профиль' });
      return;
    }

    toast({ title: 'Профиль создан', description: 'Добро пожаловать!' });
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Link
          href="/auth/register"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-primary">Создать профиль</h1>
          <p className="mt-2 text-sm text-primary/80">Настройте профиль для ребёнка</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Цвет аватара</p>
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
              Имя ребёнка <span className="text-destructive">*</span>
            </label>
            <Input
              className="h-12 rounded-[16px] border-2 border-[#D0D8DF] text-sm"
              placeholder="Например, Маша"
              {...register('name')}
            />
            {errors.name?.message ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">
              Возраст (4-13 лет) <span className="text-destructive">*</span>
            </label>
            <Input
              className="h-12 rounded-[16px] border-2 border-[#D0D8DF] text-sm"
              placeholder="Например, 7"
              {...register('age')}
            />
            {errors.age?.message ? <p className="text-xs text-destructive">{errors.age.message}</p> : null}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary">
              Интересы <span className="text-destructive">*</span>
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
                    {interest}
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
            {isSubmitting ? 'Сохраняем...' : 'Создать профиль'}
          </Button>
        </form>
      </div>
    </div>
  );
}
