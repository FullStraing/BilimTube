'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { ToastStateProvider } from '@/components/ui/use-toast';
import { LocaleProvider } from '@/components/i18n/locale-provider';
import type { Locale } from '@/lib/i18n/messages';

export function Providers({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <LocaleProvider locale={locale}>
      <QueryClientProvider client={queryClient}>
        <ToastStateProvider>
          {children}
          <Toaster />
        </ToastStateProvider>
      </QueryClientProvider>
    </LocaleProvider>
  );
}

