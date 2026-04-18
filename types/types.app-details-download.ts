// appDownload.types.ts
import { HomeAppItem } from './home-apps.types';
import {
  AppLink,
  AppModder,
  EnumPlatformType,
  RelatedAppType,
} from './types.app';

// -----------------------------
// FAQ
// -----------------------------
export interface DownloadFaq {
  id: string;
  title: string;
  content: string;
  platform: EnumPlatformType;
  created_at: string;
  updated_at: string;
}

// -----------------------------
// Settings: Icons
// -----------------------------
export interface IconItem {
  url: string;
  name: string;
  alt_text: string;
}

export interface IconsSettingValue {
  icons: IconItem[];
  verified_badge_tooltip_text: string;
}

// -----------------------------
// Settings: Buttons
// -----------------------------
export interface ButtonConfig {
  label: string;
  is_enabled: boolean;
}

export interface TelegramButtonConfig extends ButtonConfig {
  url: string;
  is_open_new_tab: boolean;
}

export interface ButtonsSettingValue {
  download_button: ButtonConfig;
  telegram_button: TelegramButtonConfig;
  installation_guideline: string; // HTML content
}

// -----------------------------
// Generic Setting Wrapper (Typed)
// -----------------------------
export type SettingKey = 'icons' | 'buttons';

export interface BaseSetting<T = unknown> {
  id: string;
  key: SettingKey;
  value: T;
  created_at: string;
  updated_at: string;
}

// Strongly Typed Settings (Discriminated Union)
export type AppSetting =
  | (BaseSetting<IconsSettingValue> & { key: 'icons' })
  | (BaseSetting<ButtonsSettingValue> & { key: 'buttons' });

// -----------------------------
// Main App Download Data
// -----------------------------
export interface AppDownloadDetails {
  id: string;
  name: string;
  slug: string;
  genre: string;

  platform: EnumPlatformType;
  icon: string;

  is_verified: boolean;
  modders: AppModder[];

  created_at: string;
  updated_at: string;

  links: AppLink[]; // extend later when structure is known
  related?: Record<RelatedAppType, HomeAppItem[]>;
  settings: AppSetting[];
  downloadFaqs: DownloadFaq[];
}

// -----------------------------
// Final Response Type
// -----------------------------
