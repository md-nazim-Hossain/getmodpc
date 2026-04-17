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

type IconName =
  | 'android_icon'
  | 'apple_icon'
  | 'windows_icon'
  | 'version_icon'
  | 'size_icon'
  | 'premium_unlocked_icon'
  | 'verified_badge_icon';
export interface AppIcon {
  url: string;
  name: IconName;
  alt_text: string;
}

export interface SettingsHomeValue {
  icons: AppIcon[];
  verified_badge_tooltip_text: string;
}

export interface SettingsAppDetailsValue extends Partial<SettingsHomeValue> {
  download_button: {
    label: string;
    is_enabled: true;
  };
  telegram_button: {
    url: string;
    label: string;
    is_enabled: boolean;
    is_open_new_tab: boolean;
  };
  installation_guideline: string;
}

export interface Settings<T> {
  id: string;
  key: string;
  value: T;
  created_at: string;
  updated_at: string;
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

  settings: Settings<SettingsHomeValue>[];
}

// Final Typed Response
