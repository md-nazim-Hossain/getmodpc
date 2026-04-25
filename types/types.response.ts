import { PaginationMeta, ReportReason, Testimonial } from '.';
import { Ad } from './ads';
import { GlobalSetting } from './global-settings.types';
import {
  HomeAppItem,
  HomeAppsData,
  SearchAppItem,
  Settings,
  SettingsHomeValue,
} from './home-apps.types';
import { Page } from './page.types';
import { AppDetails } from './types.app';
import { AppDownloadDetails } from './types.app-details-download';

// ─── Core wrapper — single source of truth for ALL API responses ──────────────

export interface ApiResponse<TData, TMeta = null> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: TMeta | null;
  data: TData;
}

// ─── Convenience alias for mutation responses that return no data ─────────────
//     e.g. ratings, reports, contacts — server returns { success, message, statusCode }

export type ApiVoidResponse = ApiResponse<null>;

// ─── GET responses ────────────────────────────────────────────────────────────

export type HomeAppsResponse = ApiResponse<HomeAppsData>;
export type AppDetailsResponse = ApiResponse<AppDetails>;
export type AdResponse = ApiResponse<Ad[]>;
export type ReportReasonResponse = ApiResponse<ReportReason[]>;
export type ActiveTestimonialResponse = ApiResponse<Testimonial[]>;
export type DownloadAppResponse = ApiResponse<AppDownloadDetails>;
export type InputSearchAppsResponse = ApiResponse<SearchAppItem[]>;
export type GlobalSettingsResponse = ApiResponse<GlobalSetting[]>;
export type PageResponse = ApiResponse<Page>;

// Paginated responses share the same data shape — grouped for clarity
type PaginatedAppsData = {
  apps: HomeAppItem[];
  settings: Settings<SettingsHomeValue>[];
};

export type CategoryAppsResponse = ApiResponse<
  PaginatedAppsData,
  PaginationMeta
>;
export type SearchAppsResponse = ApiResponse<PaginatedAppsData, PaginationMeta>;
export type DeveloperAppsResponse = ApiResponse<
  PaginatedAppsData,
  PaginationMeta
>;

// ─── POST / PUT / PATCH / DELETE responses ────────────────────────────────────

// Rating: server returns no meaningful data body
export type AppRatingResponse = ApiVoidResponse;

// Download APK prepare: server returns token + file metadata
export type DownloadApkResult = {
  token: string;
  size: string;
  type: string;
  name: string;
};
export type DownloadApkResponse = ApiResponse<DownloadApkResult>;
