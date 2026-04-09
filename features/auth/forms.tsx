'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { useLocale } from '@/components/i18n/locale-provider';
import { translate } from '@/lib/i18n/messages';
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from './schemas';

const segmentedRoot =
  'flex w-full max-w-[320px] items-center rounded-[20px] bg-secondary p-1.5 text-sm font-medium';
const segmentedItem =
  'flex-1 rounded-[16px] py-2.5 text-center transition shadow-soft hover:brightness-95';

const countries = [
  { code: 'KG', name: { ru: 'Кыргызстан', en: 'Kyrgyzstan', ky: 'Кыргызстан' }, dial: '+996' },
  { code: 'RU', name: { ru: 'Россия', en: 'Russia', ky: 'Россия' }, dial: '+7' },
  { code: 'US', name: { ru: 'США', en: 'USA', ky: 'АКШ' }, dial: '+1' },
  { code: 'GB', name: { ru: 'Великобритания', en: 'United Kingdom', ky: 'Улуу Британия' }, dial: '+44' },
  { code: 'DE', name: { ru: 'Германия', en: 'Germany', ky: 'Германия' }, dial: '+49' }
];

function FieldError({ message }: { message?: string }) {
  const locale = useLocale();
  if (!message) return null;
  return <p className="text-xs text-destructive">{translate(locale, message)}</p>;
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-start">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
          aria-label={translate(locale, 'common.back')}
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

function AuthMethodSwitch({
  method,
  onMethodChange
}: {
  method: 'email' | 'phone';
  onMethodChange: (method: 'email' | 'phone') => void;
}) {
  const locale = useLocale();

  return (
    <div className="mt-6 flex justify-center">
      <div className={segmentedRoot}>
        <button
          type="button"
          className={`${segmentedItem} ${method === 'email' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
          onClick={() => onMethodChange('email')}
        >
          {translate(locale, 'auth.email')}
        </button>
        <button
          type="button"
          className={`${segmentedItem} ${method === 'phone' ? 'bg-white text-primary hover:brightness-95' : 'text-primary/70 shadow-none'}`}
          onClick={() => onMethodChange('phone')}
        >
          {translate(locale, 'auth.phone')}
        </button>
      </div>
    </div>
  );
}

function AuthIdentifierField<T extends FieldValues>({
  method,
  country,
  setCountry,
  isCountryMenuOpen,
  setIsCountryMenuOpen,
  countryMenuRef,
  register,
  errorMessage
}: {
  method: 'email' | 'phone';
  country: (typeof countries)[number];
  setCountry: (country: (typeof countries)[number]) => void;
  isCountryMenuOpen: boolean;
  setIsCountryMenuOpen: (open: boolean) => void;
  countryMenuRef: RefObject<HTMLDivElement>;
  register: UseFormRegister<T>;
  errorMessage?: string;
}) {
  const locale = useLocale();

  if (method === 'email') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-primary">
          {translate(locale, 'auth.email')} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <Input
            className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pl-12 text-sm"
            placeholder="example@mail.com"
            {...register('identifier' as Path<T>)}
          />
        </div>
        <FieldError message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-primary">
        {translate(locale, 'auth.phoneNumber')} <span className="text-destructive">*</span>
      </label>
      <div ref={countryMenuRef} className="relative">
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <button
            type="button"
            className="h-12 w-full rounded-[16px] border-2 border-[#D0D8DF] bg-white px-3 text-sm font-semibold text-primary"
            onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
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
              {...register('identifier' as Path<T>)}
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
                  {item.code} {item.name[locale]}
                </span>
                <span>{item.dial}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <FieldError message={errorMessage} />
    </div>
  );
}

function useGoogleOauthErrorToast() {
  const locale = useLocale();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const oauthError = new URLSearchParams(window.location.search).get('oauth');
    if (!oauthError) return;

    const descriptionMap: Record<string, string> = {
      invalid_state: translate(locale, 'auth.oauth.invalid_state'),
      email_required: translate(locale, 'auth.oauth.email_required'),
      failed: translate(locale, 'auth.oauth.failed'),
      google_unavailable: translate(locale, 'auth.oauth.google_unavailable'),
      db_unavailable: translate(locale, 'auth.oauth.db_unavailable')
    };

    toast({
      title: translate(locale, 'auth.oauthTitle'),
      description: descriptionMap[oauthError] ?? translate(locale, 'auth.oauth.default')
    });
  }, [locale, toast]);
}

export function LoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef<HTMLDivElement>(null);

  useGoogleOauthErrorToast();

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
        toast({ title: translate(locale, 'auth.loginError'), description: data.error ?? translate(locale, 'auth.loginFailed') });
        return;
      }

      toast({ title: translate(locale, 'auth.loginTitle'), description: translate(locale, 'auth.loginSuccess') });
      router.push('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-border bg-card px-6 pb-8 pt-8 shadow-card">
          <AuthHeader title={translate(locale, 'auth.loginTitle')} subtitle={translate(locale, 'auth.loginSubtitle')} />

          <div className="mt-6">
            <GoogleAuthButton mode="login" />
          </div>

          <AuthMethodSwitch
            method={method}
            onMethodChange={(nextMethod) => {
              setMethod(nextMethod);
              setValue('method', nextMethod);
              if (nextMethod === 'email') {
                setIsCountryMenuOpen(false);
              }
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <AuthIdentifierField
              method={method}
              country={country}
              setCountry={setCountry}
              isCountryMenuOpen={isCountryMenuOpen}
              setIsCountryMenuOpen={setIsCountryMenuOpen}
              countryMenuRef={countryMenuRef}
              register={register}
              errorMessage={errors.identifier?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                {translate(locale, 'auth.password')} <span className="text-destructive">*</span>
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
                  aria-label={translate(locale, 'auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            <Link href="/" className="text-sm font-semibold text-primary">{translate(locale, 'auth.forgotPassword')}</Link>

            <Button
              type="submit"
              className="h-14 w-full rounded-[20px] bg-primary text-base font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? translate(locale, 'auth.signingIn') : translate(locale, 'auth.signIn')}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-primary">
            {translate(locale, 'auth.noAccount')}{' '}
            <Link href="/auth/register" className="font-semibold">
              {translate(locale, 'auth.create')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [accountType, setAccountType] = useState<'self' | 'family'>('self');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef<HTMLDivElement>(null);

  useGoogleOauthErrorToast();

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
        toast({
          title: translate(locale, 'auth.registerError'),
          description: data.error ?? translate(locale, 'auth.registerFailed')
        });
        return;
      }

      toast({ title: translate(locale, 'auth.registerTitle'), description: translate(locale, 'auth.registerSuccess') });
      router.push('/child/create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-border bg-card px-6 pb-8 pt-8 shadow-card">
          <AuthHeader title={translate(locale, 'auth.registerTitle')} subtitle={translate(locale, 'auth.registerSubtitle')} />

          <div className="mt-6">
            <GoogleAuthButton mode="register" />
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-primary">{translate(locale, 'auth.accountType')}</p>
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
              <div className="text-sm font-semibold">{translate(locale, 'auth.accountSelfTitle')}</div>
              <div className="mt-1 text-xs opacity-80">{translate(locale, 'auth.accountSelfDesc')}</div>
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
              <div className="text-sm font-semibold">{translate(locale, 'auth.accountFamilyTitle')}</div>
              <div className="mt-1 text-xs opacity-80">{translate(locale, 'auth.accountFamilyDesc')}</div>
            </button>
          </div>

          <AuthMethodSwitch
            method={method}
            onMethodChange={(nextMethod) => {
              setMethod(nextMethod);
              setValue('method', nextMethod);
              if (nextMethod === 'email') {
                setIsCountryMenuOpen(false);
              }
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <AuthIdentifierField
              method={method}
              country={country}
              setCountry={setCountry}
              isCountryMenuOpen={isCountryMenuOpen}
              setIsCountryMenuOpen={setIsCountryMenuOpen}
              countryMenuRef={countryMenuRef}
              register={register}
              errorMessage={errors.identifier?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                {translate(locale, 'auth.password')} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pr-12 text-sm"
                  placeholder={translate(locale, 'auth.minChars')}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  aria-label={translate(locale, 'auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                {translate(locale, 'auth.confirmPassword')} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  className="h-12 rounded-[16px] border-2 border-[#D0D8DF] pr-12 text-sm"
                  placeholder={translate(locale, 'auth.enterPasswordAgain')}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  aria-label={translate(locale, 'auth.showPassword')}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-[20px] bg-primary text-base font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? translate(locale, 'auth.creating') : translate(locale, 'auth.signUp')}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-primary">
            {translate(locale, 'auth.haveAccount')}{' '}
            <Link href="/auth/login" className="font-semibold">
              {translate(locale, 'auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthScaffold({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">{children}</div>
    </div>
  );
}

