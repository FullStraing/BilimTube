import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/app-shell';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'BilimTube',
  description: 'Образовательная видеоплатформа'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={manrope.variable}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

