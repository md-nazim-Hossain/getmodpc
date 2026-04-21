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

export interface ApiResponse<T, TMeta = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: TMeta | null;
  data: T;
}

export type HomeAppsResponse = ApiResponse<HomeAppsData>;

export type CategoryAppsResponse = ApiResponse<
  {
    apps: HomeAppItem[];
    settings: Settings<SettingsHomeValue>[];
  },
  PaginationMeta
>;
export type SearchAppsResponse = ApiResponse<
  {
    apps: HomeAppItem[];
    settings: Settings<SettingsHomeValue>[];
  },
  PaginationMeta
>;

export type DeveloperAppsResponse = ApiResponse<
  {
    apps: HomeAppItem[];
    settings: Settings<SettingsHomeValue>[];
  },
  PaginationMeta
>;

export type AppDetailsResponse = ApiResponse<AppDetails>;

export type AdResponse = ApiResponse<Ad[]>;

export type ReportReasonResponse = ApiResponse<ReportReason[]>;

export type ActiveTestimonialResponse = ApiResponse<Testimonial[]>;

export type DownloadAppResponse = ApiResponse<AppDownloadDetails>;

export type AppRatingResponse = {
  message: string;
  statusCode: number;
  success: boolean;
};

export type InputSearchAppsResponse = ApiResponse<SearchAppItem[]>;

export type GlobalSettingsResponse = ApiResponse<GlobalSetting[]>;

export type PageResponse = ApiResponse<Page>;
