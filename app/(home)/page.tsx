// app/(home)/page.tsx
//
// Migrated from local mock data → live API response (HomeAppsData).
//
// Structural changes:
//   - All mock data imports (popularApps, popularGames, etc.) REMOVED.
//     Data now comes entirely from `data.data` (HomeAppsData).
//   - `newReleaseApps`  → `data.data.newReleasedApps`   (renamed in HomeAppsData)
//   - `newReleaseGames` → `data.data.newReleasedGames`  (renamed in HomeAppsData)
//   - `appCategories` + `gameCategories` → `data.data.categories`
//     (HomeAppsData merges both into one Category[] array)
//   - CategoryCard now receives `Category` items; `getId` extractor uses
//     `parent_id` since Category has no top-level `id`.
//   - HeroSection receives `HomeAppItem[]` directly — type is already aligned.
//   - AppCard receives `HomeAppItem` — type updated in app-card.tsx.
//   - `heroSlides` mock import removed — slider data comes from `data.data.sliderApps`.
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getADs } from '@/server/get/get-ads';
import { getHomeApps } from '@/server/get/get-apps';
import { getActiveTestimonials } from '@/server/get/get-testimonials';

import { CategoryCard } from '@/components/cards/category-card';
import { HomeAppCard } from '@/components/cards/home-app-card';

import { ADS_SAMPLE_DATA } from '@/lib/data/ads-data';
import { TESTIMONIALS_DATA } from '@/lib/data/testimonials-data';

import AdsSection from './_components/ads-section';
import { HeroSection } from './_components/hero-section';
import { HomeSection } from './_components/home-section';
import TestimonialsSection from './_components/testimonials-section';

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
  const appData = await getHomeApps();

  const adsData = await getADs();

  const testimonialsData = await getActiveTestimonials();

  if (!appData || !appData.success || !appData.data) {
    redirect('/404');
  }

  const {
    sliderApps,
    popularApps,
    popularGames,
    latestUpdatedApps,
    latestUpdatedGames,
    // Renamed in HomeAppsData: newReleaseApps → newReleasedApps
    newReleasedApps,
    // Renamed in HomeAppsData: newReleaseGames → newReleasedGames
    newReleasedGames,
    // HomeAppsData merges appCategories + gameCategories into one array
    categories,
  } = appData.data;

  return (
    <>
      <HeroSection slides={sliderApps} />

      <AdsSection
        //ads={adsData.data} // TODO: Use this when API supports it
        ads={ADS_SAMPLE_DATA}
      />

      <HomeSection
        headerKey='popularApps'
        items={popularApps}
        renderItem={(app) => <HomeAppCard app={app} />}
      />

      <HomeSection
        headerKey='popularGames'
        items={popularGames}
        renderItem={(game) => <HomeAppCard app={game} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestApps'
        items={latestUpdatedApps}
        renderItem={(app) => <HomeAppCard app={app} showVersion />}
      />

      <HomeSection
        headerKey='newApps'
        items={newReleasedApps}
        renderItem={(app) => <HomeAppCard app={app} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestGames'
        items={latestUpdatedGames}
        renderItem={(game) => <HomeAppCard app={game} showVersion />}
      />

      <HomeSection
        headerKey='newGames'
        items={newReleasedGames}
        renderItem={(game) => <HomeAppCard app={game} />}
        variant='tinted'
      />

      {/*
       * Category sections: HomeAppsData merges the old appCategories +
       * gameCategories into a single `categories: Category[]` array.
       * `getId` uses `parent_id` because Category has no top-level `id` field.
       * If product requirements call for separate app/game category sections,
       * split `categories` by a type discriminator when the API supports it.
       */}
      <HomeSection
        headerKey='appCategories'
        items={categories}
        getId={(category) => category.parent_id}
        variant='tinted'
        gridClassName='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-5'
        renderItem={(category) => <CategoryCard category={category} />}
      />

      <TestimonialsSection
        // testimonials={testimonials.data} // TODO: Use this when API supports it
        testimonials={TESTIMONIALS_DATA}
      />
    </>
  );
}
