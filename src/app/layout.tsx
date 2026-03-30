import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { ReactNode } from 'react';

import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Контур развития',
  description: 'Единая цифровая среда обучения сотрудников ИТ-компании',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${ibmPlexSans.variable} bg-canvas font-sans text-foreground antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

