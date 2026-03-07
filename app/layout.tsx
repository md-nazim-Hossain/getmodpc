// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import { Header } from '@/components/layout/header';

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
    <html lang='en' className={inter.className}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <div className='relative flex min-h-screen flex-col'>
          {/* <Header /> */}
          <main className='flex-1'>{children}</main>
          <footer className='border-t border-border/50 bg-glass backdrop-blur-xl'>
            <div className='container-custom py-8'>
              <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <p className='text-sm text-muted-foreground'>
                  © 2024 {SITE_CONFIG.name}. All rights reserved.
                </p>
                <div className='flex gap-6 text-sm text-muted-foreground'>
                  <a
                    href='/privacy'
                    className='hover:text-foreground transition-colors'
                  >
                    Privacy Policy
                  </a>
                  <a
                    href='/terms'
                    className='hover:text-foreground transition-colors'
                  >
                    Terms of Service
                  </a>
                  <a
                    href='/contact'
                    className='hover:text-foreground transition-colors'
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
