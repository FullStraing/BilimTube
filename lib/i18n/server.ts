import { cookies } from 'next/headers';
import { isLocale, type Locale, translate } from './messages';

const DEFAULT_LOCALE: Locale = 'ru';
const LOCALE_COOKIE = 'locale';

export { translate };

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });
}
