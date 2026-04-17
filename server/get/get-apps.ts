'use server';

import {
  AppDetailsResponse,
  CategoryAppsResponse,
  DeveloperAppsResponse,
  DownloadAppResponse,
  HomeAppsResponse,
} from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getHomeApps = async (): Promise<HomeAppsResponse> =>
  fetchApi(`/apps/home-page-apps`);

export const getAppDetailsBySlug = async (
  slug: string
): Promise<AppDetailsResponse> => fetchApi(`/apps/slug/${slug}`);

export const getAppsByCategory = async (
  category: string,
  page = 1
): Promise<CategoryAppsResponse> =>
  fetchApi(`/apps/category/${category}?page=${page}`);

export const getAppsByDeveloper = async (
  developer: string
): Promise<DeveloperAppsResponse> => fetchApi(`/apps/developer/${developer}`);

export const getDownloadAppsBySlug = async (
  slug: string
): Promise<DownloadAppResponse> => fetchApi(`/apps/download/${slug}`);
