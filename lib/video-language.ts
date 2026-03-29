import type { Prisma, UiLanguage } from '@prisma/client';
import type { Locale } from '@/lib/i18n/messages';

export function uiLocaleToVideoLanguage(locale: Locale): UiLanguage {
  if (locale === 'en') return 'en';
  if (locale === 'ky') return 'ky';
  return 'ru';
}

export function buildVideoLanguageWhere(locale: Locale): Prisma.VideoWhereInput {
  return {
    language: uiLocaleToVideoLanguage(locale)
  };
}
