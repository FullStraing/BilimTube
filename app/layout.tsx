import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';
import { getLocaleFromCookie } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'BilimTube',
  description: 'Образовательная видеоплатформа'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocaleFromCookie();

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

