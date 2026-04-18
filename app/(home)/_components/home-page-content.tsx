import React from 'react';

import { HomeAppsData } from '@/types/home-apps.types';

import { CategoryCard } from '@/components/cards/category-card';
import { HomeAppCard } from '@/components/cards/home-app-card';

import AdsSection from './ads-section';
import { HeroSection } from './hero-section';
import { HomeSection, SectionHeaderKey } from './home-section';
import TestimonialsSection from './testimonials-section';

const HomePageContent: React.FC<{ data: HomeAppsData }> = ({ data }) => {
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
    settings,
    ads,
    testimonials,
  } = data;
  return (
    <>
      <HeroSection slides={sliderApps} settings={settings} />

      <AdsSection ads={ads} />

      <HomeSection
        headerKey='popularApps'
        items={popularApps}
        renderItem={(app) => <HomeAppCard app={app} settings={settings} />}
      />

      <HomeSection
        headerKey='popularGames'
        items={popularGames}
        renderItem={(game) => <HomeAppCard app={game} settings={settings} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestApps'
        items={latestUpdatedApps}
        renderItem={(app) => <HomeAppCard app={app} settings={settings} />}
      />

      <HomeSection
        headerKey='newApps'
        items={newReleasedApps}
        renderItem={(app) => <HomeAppCard app={app} settings={settings} />}
        variant='tinted'
      />

      <HomeSection
        headerKey='latestGames'
        items={latestUpdatedGames}
        renderItem={(game) => <HomeAppCard app={game} settings={settings} />}
      />

      <HomeSection
        headerKey='newGames'
        items={newReleasedGames}
        renderItem={(game) => <HomeAppCard app={game} settings={settings} />}
        variant='tinted'
      />

      {/*
       * Category sections: HomeAppsData merges the old appCategories +
       * gameCategories into a single `categories: Category[]` array.
       * `getId` uses `parent_id` because Category has no top-level `id` field.
       * If product requirements call for separate app/game category sections,
       * split `categories` by a type discriminator when the API supports it.
       */}
      {categories.map((category) => (
        <HomeSection
          key={category?.parent_id}
          headerKey={category?.parent_slug as SectionHeaderKey}
          items={category?.categories}
          getId={(category) => category?.id}
          variant='tinted'
          gridClassName='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-5'
          renderItem={(category) => <CategoryCard category={category} />}
        />
      ))}

      <TestimonialsSection testimonials={testimonials} />
    </>
  );
};

export default HomePageContent;
