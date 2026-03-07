// app/page.tsx

import {
  heroSlides,
  popularApps,
  popularGames,
  latestUpdatedApps,
  newReleaseApps,
  latestUpdatedGames,
  newReleaseGames,
  appCategories,
  gameCategories,
} from '@/lib/mock-data';
import { HeroSection } from './_components/hero-section';
import { PopularAppsSection } from './_components/popular-apps';
import { PopularGamesSection } from './_components/popular-games';
import { LatestUpdateAppsSection } from './_components/latest-update-app';
import { NewReleaseAppsSection } from './_components/new-release-apps';
import { LatestUpdateGamesSection } from './_components/latest-updated-games';
import { NewReleaseGamesSection } from './_components/new-release-games';
import { AppCategoriesSection } from './_components/app-categories';
import { GameCategoriesSection } from './_components/game-categoreis';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Slider Section */}
      <HeroSection slides={heroSlides} />

      {/* 2. Popular Apps Section */}
      <PopularAppsSection apps={popularApps} />

      {/* 3. Popular Games Section */}
      <PopularGamesSection games={popularGames} />

      {/* 4. Latest Updated Apps Section */}
      <LatestUpdateAppsSection apps={latestUpdatedApps} />

      {/* 5. New Release Apps Section */}
      <NewReleaseAppsSection apps={newReleaseApps} />

      {/* 6. Latest Updated Games Section */}
      <LatestUpdateGamesSection games={latestUpdatedGames} />

      {/* 7. New Release Games Section */}
      <NewReleaseGamesSection games={newReleaseGames} />

      {/* 8. App Categories Section */}
      <AppCategoriesSection categories={appCategories} />

      {/* 9. Game Categories Section */}
      <GameCategoriesSection categories={gameCategories} />
    </>
  );
}
