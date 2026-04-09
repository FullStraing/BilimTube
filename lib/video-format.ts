import type { Locale } from '@/lib/i18n/messages';

export function formatDuration(durationSec: number) {
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatViews(viewsCount: number, locale: Locale = 'ru') {
  const suffix = locale === 'en' ? 'views' : locale === 'ky' ? '?????' : '??????????';

  if (viewsCount >= 1_000_000) {
    return `${(viewsCount / 1_000_000).toFixed(1)}M ${suffix}`;
  }
  if (viewsCount >= 1_000) {
    return `${(viewsCount / 1_000).toFixed(1)}K ${suffix}`;
  }
  return `${viewsCount} ${suffix}`;
}
