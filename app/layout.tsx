import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AppSettingsProvider } from '@/provider/app-settings-provider';
import TanstackProvider from '@/provider/tanstack-provider';
import { findSetting } from '@/types/global-settings.types';
import { Toaster } from 'sonner';

import { getGlobalSettings } from '@/server/get/get-settings';

import { Footer } from '@/components/layout/footer';
import { PlatformTabs } from '@/components/platform-tabs';
import { ThemeInjector } from '@/components/theme-injector';

import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  const seo = findSetting(settings.data, 'seo')?.value;
  const site = findSetting(settings.data, 'system_settings')?.value.site;

  return {
    title: {
      default: seo?.site_name ?? 'App',
      template: `%s - ${seo?.site_name ?? 'App'}`,
    },
    description: seo?.meta_description || undefined,
    keywords: seo?.meta_keywords?.split(',').map((k) => k.trim()),
    metadataBase: seo?.canonical_url ? new URL(seo.canonical_url) : undefined,
    openGraph: {
      siteName: seo?.site_name,
      title: seo?.og_title || seo?.meta_title || undefined,
      description: seo?.og_description || seo?.meta_description || undefined,
    },
    robots: {
      index: seo?.robots_index ?? true,
      follow: seo?.robots_follow ?? true,
    },

    icons: {
      icon: site?.favicon_url ?? '/favicon.ico',
      shortcut: site?.favicon_url ?? '/favicon.ico',
    },
  };
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettings();
  const theme =
    findSetting(settings.data, 'system_settings')?.value.theme ?? null;
  const footer = findSetting(settings.data, 'footer')?.value ?? null;
  const socials =
    findSetting(settings.data, 'social_links')?.value.social_links ?? [];

  return (
    <html suppressHydrationWarning lang='en' className={inter.className}>
      <head>
        {/* Injects dynamic :root overrides before any paint */}
        <ThemeInjector theme={theme} />
      </head>
      <body
        suppressHydrationWarning
        className='min-h-screen bg-background font-sans antialiased'
      >
        <TanstackProvider>
          <AppSettingsProvider settings={settings.data}>
            <div className='relative flex min-h-screen flex-col'>
              <main className='flex-1'>{children}</main>
              <Footer footer={footer} socialLinks={socials} />
            </div>
            <Toaster />
            <PlatformTabs />
          </AppSettingsProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
