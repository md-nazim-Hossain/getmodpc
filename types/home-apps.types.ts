import { ApiResponse } from '.';

export interface HomeAppItem {
  id: string;
  name: string;
  slug: string;
  platform: 'android' | 'ios' | string;
  type: 'app' | 'game' | string;
  header_image: string;
  icon: string;
  version: string;
  size: string;
  is_verified: boolean;
  short_mode: string;
  updated_at: string; // ISO Date
}

// Category Structure
export interface Category {
  parent_id: string;
  parent_name: string;
  parent_slug: string;
  categories: Category[]; // recursive (future-proof)
}

// Home Page Data Structure
export interface HomeAppsData {
  sliderApps: HomeAppItem[];

  popularApps: HomeAppItem[];
  popularGames: HomeAppItem[];

  latestUpdatedApps: HomeAppItem[];
  latestUpdatedGames: HomeAppItem[];

  newReleasedApps: HomeAppItem[];
  newReleasedGames: HomeAppItem[];

  categories: Category[];
}

// Final Typed Response
export type HomeAppsResponse = ApiResponse<HomeAppsData>;
