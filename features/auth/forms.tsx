'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from './schemas';

const segmentedRoot =
  'flex w-full max-w-[320px] items-center rounded-[20px] bg-secondary p-1.5 text-sm font-medium';
const segmentedItem =
  'flex-1 rounded-[16px] py-2.5 text-center transition shadow-soft hover:brightness-95';

const countries = [
  { code: 'KG', name: 'Кыргызстан', dial: '+996' },
  { code: 'RU', name: 'Россия', dial: '+7' },
  { code: 'US', name: 'США', dial: '+1' },
  { code: 'GB', name: 'Великобритания', dial: '+44' },
  { code: 'DE', name: 'Германия', dial: '+49' }
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-start">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label="Назад"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>
      <span className="text-[34px] font-black tracking-[0.04em] text-[#0B3F58]">BILIMTUBE</span>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        <p className="mt-2 text-sm text-primary/80">{subtitle}</p>
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!countryMenuRef.current) return;
      if (!countryMenuRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { method: 'email', identifier: '', password: '' }
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const identifier =
        values.method === 'phone' ? `${country.dial}${values.identifier}` : values.identifier;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: values.method,
          identifier,
          password: values.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Ошибка входа', description: data.error ?? 'Не удалось войти' });
        return;
      }

      toast({ title: 'Вход', description: 'Успешный вход' });
      router.push('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-border bg-card px-6 pb-8 pt-8 shadow-card">
          <AuthHeader title="Вход" subtitle="Войдите в свой аккаунт" />

          <div className="mt-6 flex justify-center">
            <div className={segmentedRoot}>
              <button
                type="button"
                className={`${segmentedItem} ${method === 'email' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
                onClick={() => {
                  setMethod('email');
                  setValue('method', 'email');
                  setIsCountryMenuOpen(false);
                }}
              >
                Email
              </button>
              <button
                type="button"
                className={`${segmentedItem} ${method === 'phone' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
                onClick={() => {
                  setMethod('phone');
                  setValue('method', 'phone');
                }}
              >
                Телефон
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {method === 'email' ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pl-12 text-sm"
                    placeholder="example@mail.com"
                    {...register('identifier')}
                  />
                </div>
                <FieldError message={errors.identifier?.message} />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">
                  Номер телефона <span className="text-destructive">*</span>
                </label>
                <div ref={countryMenuRef} className="relative">
                  <div className="grid grid-cols-[120px_1fr] gap-3">
                    <button
                      type="button"
                      className="h-12 w-full rounded-[16px] border-2 border-[#D0D8DF] bg-white px-3 text-sm font-semibold text-primary"
                      onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                    >
                      {country.code} {country.dial}
                    </button>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        <Phone className="h-5 w-5" />
                      </span>
                      <Input
                        className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pl-12 text-sm"
                        placeholder="(312) 123-456"
                        {...register('identifier')}
                      />
                    </div>
                  </div>
                  {isCountryMenuOpen ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 max-h-72 overflow-auto rounded-[20px] border border-[#D0D8DF] bg-white shadow-soft">
                      {countries.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold ${
                            item.code === country.code ? 'bg-secondary text-primary' : 'text-primary'
                          }`}
                          onClick={() => {
                            setCountry(item);
                            setIsCountryMenuOpen(false);
                          }}
                        >
                          <span>
                            {item.code} {item.name}
                          </span>
                          <span>{item.dial}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <FieldError message={errors.identifier?.message} />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                Пароль <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pr-12 text-sm"
                  placeholder="••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  aria-label="Показать пароль"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            <Link href="/" className="text-sm font-semibold text-primary">
              Забыли пароль?
            </Link>

            <Button
              type="submit"
              className="h-14 w-full rounded-[20px] bg-primary text-white text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Входим...' : 'Войти'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-primary">
            Нет аккаунта?{' '}
            <Link href="/auth/register" className="font-semibold">
              Создать
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [accountType, setAccountType] = useState<'self' | 'family'>('self');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!countryMenuRef.current) return;
      if (!countryMenuRef.current.contains(event.target as Node)) {
        setIsCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      method: 'email',
      accountType: 'self',
      identifier: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      const identifier =
        values.method === 'phone' ? `${country.dial}${values.identifier}` : values.identifier;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: values.method,
          identifier,
          password: values.password,
          accountType: values.accountType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Ошибка регистрации', description: data.error ?? 'Не удалось создать аккаунт' });
        return;
      }

      toast({ title: 'Регистрация', description: 'Аккаунт создан' });
      router.push('/child/create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-border bg-card px-6 pb-8 pt-8 shadow-card">
          <AuthHeader title="Регистрация" subtitle="Создайте аккаунт для доступа" />

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-primary">Тип аккаунта</p>
            <button
              type="button"
              className={`w-full rounded-[18px] border-2 px-4 py-3 text-left transition ${
                accountType === 'self'
                  ? 'border-primary bg-primary text-white hover:brightness-110'
                  : 'border-[#D0D8DF] bg-white text-primary hover:brightness-95'
              }`}
              onClick={() => {
                setAccountType('self');
                setValue('accountType', 'self');
              }}
            >
              <div className="text-sm font-semibold">Только для себя</div>
              <div className="mt-1 text-xs opacity-80">Родительский аккаунт для контроля</div>
            </button>
            <button
              type="button"
              className={`w-full rounded-[18px] border-2 px-4 py-3 text-left transition ${
                accountType === 'family'
                  ? 'border-primary bg-primary text-white hover:brightness-110'
                  : 'border-[#D0D8DF] bg-white text-primary hover:brightness-95'
              }`}
              onClick={() => {
                setAccountType('family');
                setValue('accountType', 'family');
              }}
            >
              <div className="text-sm font-semibold">Для себя и ребенка</div>
              <div className="mt-1 text-xs opacity-80">Один номер/email для обоих аккаунтов</div>
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <div className={segmentedRoot}>
              <button
                type="button"
                className={`${segmentedItem} ${method === 'email' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
                onClick={() => {
                  setMethod('email');
                  setValue('method', 'email');
                  setIsCountryMenuOpen(false);
                }}
              >
                Email
              </button>
              <button
                type="button"
                className={`${segmentedItem} ${method === 'phone' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
                onClick={() => {
                  setMethod('phone');
                  setValue('method', 'phone');
                }}
              >
                Телефон
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {method === 'email' ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pl-12 text-sm"
                    placeholder="example@mail.com"
                    {...register('identifier')}
                  />
                </div>
                <FieldError message={errors.identifier?.message} />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">
                  Номер телефона <span className="text-destructive">*</span>
                </label>
                <div ref={countryMenuRef} className="relative">
                  <div className="grid grid-cols-[120px_1fr] gap-3">
                    <button
                      type="button"
                      className="h-12 w-full rounded-[16px] border-2 border-[#D0D8DF] bg-white px-3 text-sm font-semibold text-primary"
                      onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                    >
                      {country.code} {country.dial}
                    </button>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                        <Phone className="h-5 w-5" />
                      </span>
                      <Input
                        className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pl-12 text-sm"
                        placeholder="(312) 123-456"
                        {...register('identifier')}
                      />
                    </div>
                  </div>
                  {isCountryMenuOpen ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 max-h-72 overflow-auto rounded-[20px] border border-[#D0D8DF] bg-white shadow-soft">
                      {countries.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold ${
                            item.code === country.code ? 'bg-secondary text-primary' : 'text-primary'
                          }`}
                          onClick={() => {
                            setCountry(item);
                            setIsCountryMenuOpen(false);
                          }}
                        >
                          <span>
                            {item.code} {item.name}
                          </span>
                          <span>{item.dial}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <FieldError message={errors.identifier?.message} />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                Пароль <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pr-12 text-sm"
                  placeholder="Минимум 6 символов"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  aria-label="Показать пароль"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                Подтвердите пароль <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pr-12 text-sm"
                  placeholder="Введите пароль ещё раз"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  aria-label="Показать пароль"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-[20px] bg-primary text-white text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Создаем...' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-primary">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="font-semibold">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthScaffold({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">{children}</div>
    </div>
  );
}
