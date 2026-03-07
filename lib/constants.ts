// lib/constants.ts

export const SITE_CONFIG = {
  name: 'AppVault',
  description: 'Download Premium Apps & Games for Free',
  url: 'https://appvault.com',
  ogImage: '/og-image.png',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Apps', href: '/apps' },
  { label: 'Games', href: '/games' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
];

export const PLATFORM_COLORS = {
  android: '#3DDC84',
  windows: '#0078D4',
  apple: '#000000',
};

export const SECTION_HEADERS = {
  trending: {
    title: 'Trending Now',
    subtitle: "Discover what's hot in the app world",
  },
  popularApps: {
    title: 'Popular Apps',
    subtitle: 'Most downloaded apps this month',
    viewAllLink: '/apps/popular',
  },
  popularGames: {
    title: 'Popular Games',
    subtitle: "Top trending games everyone's playing",
    viewAllLink: '/games/popular',
  },
  latestApps: {
    title: 'Latest Updated Apps',
    subtitle: 'Fresh updates with new features',
    viewAllLink: '/apps/updated',
  },
  newApps: {
    title: 'New Release Apps',
    subtitle: 'Just launched apps worth trying',
    viewAllLink: '/apps/new',
  },
  latestGames: {
    title: 'Latest Updated Games',
    subtitle: 'Games with recent updates',
    viewAllLink: '/games/updated',
  },
  newGames: {
    title: 'New Release Games',
    subtitle: 'Brand new games to explore',
    viewAllLink: '/games/new',
  },
  appCategories: {
    title: 'App Categories',
    subtitle: 'Browse apps by category',
    viewAllLink: '/categories/apps',
  },
  gameCategories: {
    title: 'Game Categories',
    subtitle: 'Find your favorite game genre',
    viewAllLink: '/categories/games',
  },
};
