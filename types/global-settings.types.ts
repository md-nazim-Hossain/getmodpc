/** Reusable link shape used in social_links and footer_links */
export interface LinkItem {
  url: string;
  label: string;
  is_enabled: boolean;
  is_open_new_tab: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Setting Value Shapes  (one per key)
// ─────────────────────────────────────────────────────────────────────────────

// key: "system_settings"
export interface SiteConfig {
  logo_url: string;
  favicon_url: string;
}

export interface ThemeConfig {
  accent_color: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
}

export interface AppSettingConfig {
  app_deleted_time: string;
}

export interface SystemSettingsValue {
  site: SiteConfig;
  theme: ThemeConfig;
  setting: AppSettingConfig;
}

// key: "social_links"
export interface SocialLinksValue {
  social_links: LinkItem[];
}

// key: "footer"
export interface FooterValue {
  footer_logo: string;
  footer_links: LinkItem[];
  footer_heading: string;
  footer_description: string;
}

// key: "seo"
export interface SeoValue {
  og_title: string;
  site_name: string;
  meta_title: string;
  robots_index: boolean;
  site_tagline: string;
  canonical_url: string;
  meta_keywords: string;
  robots_follow: boolean;
  og_description: string;
  meta_description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Discriminated Union  (exhaustive — add new keys here as the API expands)
// ─────────────────────────────────────────────────────────────────────────────

export type GlobalSettingKey =
  | 'system_settings'
  | 'social_links'
  | 'footer'
  | 'seo';

interface BaseGlobalSetting<K extends GlobalSettingKey, V> {
  id: string;
  key: K;
  value: V;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export type SystemSetting = BaseGlobalSetting<
  'system_settings',
  SystemSettingsValue
>;
export type SocialLinksSetting = BaseGlobalSetting<
  'social_links',
  SocialLinksValue
>;
export type FooterSetting = BaseGlobalSetting<'footer', FooterValue>;
export type SeoSetting = BaseGlobalSetting<'seo', SeoValue>;

/** Strongly-typed discriminated union over all known global settings */
export type GlobalSetting =
  | SystemSetting
  | SocialLinksSetting
  | FooterSetting
  | SeoSetting;

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Narrow any GlobalSetting[] to a specific key's type.
 *
 * @example
 * const theme = findSetting(settings, 'system_settings')?.value.theme;
 */
export function findSetting<K extends GlobalSettingKey>(
  settings: GlobalSetting[],
  key: K
): Extract<GlobalSetting, { key: K }> | undefined {
  return settings.find(
    (s): s is Extract<GlobalSetting, { key: K }> => s.key === key
  );
}
