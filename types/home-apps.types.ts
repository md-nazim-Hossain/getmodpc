import { ApiResponse } from '.';
import { EnumAppType, EnumPlatformType } from './types.app';

export interface HomeAppItem {
  id: string;
  name: string;
  slug: string;
  platform: EnumPlatformType;
  type: EnumAppType;
  header_image: string;
  icon: string;
  version: string;
  size: string;
  is_verified: boolean;
  short_mode: string;
  updated_at: string; // ISO Date
}

export interface CategoryChild {
  id: string;
  name: string;
  slug: string;
  category_icon: string | null;
  category_bg_color: string | null;
  category_icon_bg_color: string | null;
}

// Category Structure
export interface CategoryParent {
  parent_id: string;
  parent_name: string;
  parent_slug: string;
  parent_bg_color: string | null;
  parent_icon: string | null;
  parent_icon_bg_color: string | null;
  categories: CategoryChild[]; // recursive (future-proof)
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

  categories: CategoryParent[];
}

// Final Typed Response
export type HomeAppsResponse = ApiResponse<HomeAppsData>;
