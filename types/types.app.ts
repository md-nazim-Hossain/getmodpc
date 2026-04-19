import {
  HomeAppItem,
  Settings,
  SettingsAppDetailsValue,
} from './home-apps.types';

export enum EnumAppStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
}

export enum EnumAppType {
  APP = 'app',
  GAME = 'game',
}

export enum EnumAppSource {
  PLAY_STORE = 'play_store',
  LITE_APKS = 'lite_apks',
}

/** FIX: was missing from the original – used `'android' as any` in mock-data */
export enum EnumPlatformType {
  'android' = 'android',
  'apple' = 'apple',
  'windows' = 'windows',
}

/** FIX: was missing from the original – referenced in AppBody but never defined */
export enum EnumAppCommentStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface AppLink {
  name: string;
  id: string;
  type?: string;
  size?: string;
  note?: string;
}

export interface AppModder {
  title: string | null;
  descriptions: string | null;
}

export interface IAppTags {
  id: string;
  name: string;
  slug: string;
}

export type RelatedAppType = 'byCategory' | 'similar' | 'sameDeveloper';

export interface AppDetails {
  id: string;
  slug: string;
  name: string;
  title?: string | null;
  platform?: EnumPlatformType;
  type?: EnumAppType;
  source: EnumAppSource;
  description: string;
  summary?: string | null;
  latest_news?: string | null;
  header_image?: string | null;
  icon?: string | null;
  genre: string;
  youtube_id?: string | null;
  os_version: string;
  screenshots?: string[];
  developer?: string;
  app_tags?: string[];
  app_developers?: string[];
  version?: string | null;
  latest_version?: string | null;
  show_in_slider?: boolean;
  updated?: string | null;
  status?: EnumAppStatus;
  comment_status?: EnumAppCommentStatus;
  categories?: IAppTags[];
  tags?: IAppTags[];
  url: string;
  package_name: string;
  installs: string;
  score_text: string;
  ratings?: number;
  reviews?: number;
  published_date?: string | null;
  size?: string;
  is_verified?: boolean;
  short_mode?: string;
  links?: AppLink[];
  modders?: AppModder[];
  last_version_checked_at?: string | null;
  related?: Record<RelatedAppType, HomeAppItem[]>;
  settings: Settings<SettingsAppDetailsValue>[];
}

/**
 * FIX: Intersection types scattered across components have been consolidated here.
 * All page-level components should accept AppWithSlug, not AppBody & { slug: string }.
 */
export type AppWithSlug = AppDetails & { slug: string };

/**
 * NEW: Separate domain type for related/card apps so AppCard does not
 * depend on the heavy AppBody shape. Lives here, not in mock-data.ts.
 */
export interface AppCardData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  genre: string;
  score_text: string;
  ratings: number;
  size: string;
  short_mode?: string;
  is_verified?: boolean;
}

/**
 * NEW: typed metadata row shape used by AppDetailsCard's meta grid —
 * removes the inline JSX object array with implicit types.
 */
export interface MetaItem {
  label: string;
  value: string | null | undefined;
  /** Icon node. Keep ReactNode here; import from the component layer, not here. */
  iconName: string;
}
