// app/(home)/page.tsx
import type { Metadata } from 'next';

import { AppCard } from '@/components/cards/app-card';
import { CategoryCard } from '@/components/cards/category-card';

import {
  appCategories,
  gameCategories,
  heroSlides,
  latestUpdatedApps,
  latestUpdatedGames,
  newReleaseApps,
  newReleaseGames,
  popularApps,
  popularGames,
} from '@/lib/mock-data';

import { HeroSection } from './_components/hero-section';
import { HomeSection } from './_components/home-section';

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

export default function HomePage() {
  return (
    <>
      <HeroSection slides={heroSlides} />

      <HomeSection
        headerKey='popularApps'
        items={popularApps}
        renderItem={(app) => <AppCard app={app} />}
      />

      <HomeSection
        headerKey='popularGames'
        items={popularGames}
        renderItem={(game) => <AppCard app={game} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestApps'
        items={latestUpdatedApps}
        renderItem={(app) => <AppCard app={app} showVersion />}
      />

      <HomeSection
        headerKey='newApps'
        items={newReleaseApps}
        renderItem={(app) => <AppCard app={app} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestGames'
        items={latestUpdatedGames}
        renderItem={(game) => <AppCard app={game} showVersion />}
      />

      <HomeSection
        headerKey='newGames'
        items={newReleaseGames}
        renderItem={(game) => <AppCard app={game} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='appCategories'
        items={appCategories}
        variant='tinted'
        gridClassName='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-5'
        renderItem={(category) => <CategoryCard category={category} />}
      />

      <HomeSection
        headerKey='gameCategories'
        items={gameCategories}
        gridClassName='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-5'
        renderItem={(category) => <CategoryCard category={category} />}
        variant='tinted'
      />
    </>
  );
}
