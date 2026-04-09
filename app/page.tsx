import Image from 'next/image';
import Link from 'next/link';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { cn } from '@/lib/utils';

const buttonBase =
  'flex h-14 w-full max-w-[320px] items-center justify-center rounded-[20px] text-base font-semibold transition';

export default async function HomePage() {
  const locale = await getLocaleFromCookie();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-6">
        <Image src="/assets/bars.png" alt="BilimTube" width={240} height={240} priority />
        <div className="text-center">
          <h1 className="text-[36px] font-extrabold tracking-[0.04em] text-primary">BILIMTUBE</h1>
          <p className="mt-4 text-[18px] font-medium text-primary">{translate(locale, 'landing.subtitle')}</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <Link href="/auth/login" className={cn(buttonBase, 'bg-primary text-white hover:brightness-110')}>
          {translate(locale, 'landing.login')}
        </Link>
        <Link href="/auth/register" className={cn(buttonBase, 'bg-secondary text-primary hover:brightness-95')}>
          {translate(locale, 'landing.register')}
        </Link>
      </div>
    </div>
  );
}
