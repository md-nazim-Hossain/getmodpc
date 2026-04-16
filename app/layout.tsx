// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/footer';

import { SITE_CONFIG } from '@/lib/constants';

import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'apps',
    'games',
    'download',
    'premium',
    'modded',
    'android',
    'windows',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en' className={inter.className}>
      <body
        suppressHydrationWarning
        className='min-h-screen bg-background font-sans  antialiased'
      >
        <div className='relative flex min-h-screen flex-col'>
          {/* <Header /> */}
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
