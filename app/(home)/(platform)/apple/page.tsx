import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { EnumPlatformType } from '@/types/types.app';

import { getHomeApps } from '@/server/get/get-apps';

import HomePageContent from '../../_components/home-page-content';

export const metadata: Metadata = {
  title: 'AppStore — Discover the Best Apps & Games',
  description:
    'Browse thousands of apps and games. Find the latest releases, most popular titles, and top categories all in one place.',
  openGraph: {
    type: 'website',
    title: 'AppStore — Discover the Best Apps & Games',
    description:
      'Browse thousands of apps and games. Find the latest releases, most popular titles, and top categories.',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppStore — Discover the Best Apps & Games',
    description: 'Browse thousands of apps and games.',
    images: ['/opengraph-image.png'],
  },
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  const appData = await getHomeApps(EnumPlatformType.apple);

  if (!appData || !appData.success || !appData.data) {
    redirect('/404');
  }

  return <HomePageContent data={appData.data} />;
}
