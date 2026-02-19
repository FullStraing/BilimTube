import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'BilimTube',
  description: 'Образовательная видеоплатформа'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
