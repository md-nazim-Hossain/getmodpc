import { EnumAppType, EnumPlatformType } from './types.app';

// Category
export interface AppCategory {
  id: string;
  name: string;
  slug: string;
}

// Related Section
export interface RelatedApps {
  byCategory: AppSummary[];
  similar: AppSummary[];
  sameDeveloper: AppSummary[];
}

// Lightweight App (for related lists)
export interface AppSummary {
  id?: string;
  name?: string;
  slug?: string;
  icon?: string;
  version?: string;
}

// Main App Details
export interface AppDetails {
  id: string;
  name: string;
  slug: string;
  title: string;

  source: string;
  platform: EnumPlatformType;
  type: EnumAppType;

  description: string;
  summary: string;
  latest_news: string;

  header_image: string;
  icon: string;
  screenshots: string[];
  links: {
    name: string;
    link: string;
    type: string;
    size: string;
    note: string;
  }[];

  genre: string;
  youtube_id: string;
  os_version: string;

  developer: string;
  app_tags: string[];
  app_developers: string[];

  version: string;
  latest_version: string;

  show_in_slider: boolean;
  size: string;
  is_verified: boolean;

  updated: string;
  short_mode: string;

  status: string;
  comment_status: string;

  url: string;
  package_name: string;

  installs: string;
  score_text: string;
  ratings: number;
  reviews: number;

  published_date: string;

  modders: { title: string; description: string }[];
  last_version_checked_at: string | null;

  is_deleted: boolean;
  deleted_at: string | null;

  created_at: string;
  updated_at: string;

  categories: AppCategory[];
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];

  related: RelatedApps;
  settings: unknown[];
}
