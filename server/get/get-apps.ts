'use server';

import {
  AppDetailsResponse,
  CategoryAppsResponse,
  DeveloperAppsResponse,
  HomeAppsResponse,
} from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getHomeApps = async (): Promise<HomeAppsResponse> =>
  fetchApi(`/apps/home-page-apps`);

export const getAppDetailsBySlug = async (
  slug: string
): Promise<AppDetailsResponse> => fetchApi(`/apps/slug/${slug}`);

export const getAppsByCategory = async (
  category: string
): Promise<CategoryAppsResponse> => fetchApi(`/apps/category/${category}`);

export const getAppsByDeveloper = async (
  developer: string
): Promise<DeveloperAppsResponse> => fetchApi(`/apps/developer/${developer}`);
