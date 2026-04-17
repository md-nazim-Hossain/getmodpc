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
    title: 'indispensable on your phone',
    subtitle: "Discover what's hot in the app world",
  },
  popularApps: {
    title: 'Popular Apps',
    subtitle: 'Most downloaded apps this month',
    viewAllLink: '/category/apps',
  },
  popularGames: {
    title: 'Popular Games',
    subtitle: "Top trending games everyone's playing",
    viewAllLink: '/category/games',
  },
  latestApps: {
    title: 'Latest Updated Apps',
    subtitle: 'Fresh updates with new features',
    viewAllLink: '/category/apps',
  },
  newApps: {
    title: 'New Release Apps',
    subtitle: 'Just launched apps worth trying',
    viewAllLink: '/category/apps',
  },
  latestGames: {
    title: 'Latest Updated Games',
    subtitle: 'Games with recent updates',
    viewAllLink: '/category/games',
  },
  newGames: {
    title: 'New Release Games',
    subtitle: 'Brand new games to explore',
    viewAllLink: '/category/games',
  },
  apps: {
    title: 'App Categories',
    subtitle: 'Browse apps by category',
    viewAllLink: '/category/apps',
  },
  games: {
    title: 'Game Categories',
    subtitle: 'Find your favorite game genre',
    viewAllLink: '/category/games',
  },
};
