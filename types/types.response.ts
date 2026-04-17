import { PaginationMeta, ReportReason, Testimonial } from '.';
import { Ad } from './ads';
import {
  HomeAppItem,
  HomeAppsData,
  Settings,
  SettingsHomeValue,
} from './home-apps.types';
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
