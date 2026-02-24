'use client';

import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n/messages';

type LocaleContextValue = {
  locale: Locale;
};

const LocaleContext = createContext<LocaleContextValue>({ locale: 'ru' });

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext).locale;
}

