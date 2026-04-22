'use server';

import { EnumPlatformType } from '@/types/types.app';
import type {
  AppDetailsResponse,
  CategoryAppsResponse,
  DeveloperAppsResponse,
  DownloadAppResponse,
  HomeAppsResponse,
  InputSearchAppsResponse,
  SearchAppsResponse,
} from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getHomeApps = async (
  platform?: EnumPlatformType
): Promise<HomeAppsResponse> =>
  fetchGet('/apps/home-page-apps', {
    params: platform ? { platform } : undefined,
  });

export const getAppDetailsBySlug = async (
  slug: string
): Promise<AppDetailsResponse> => fetchGet(`/apps/slug/${slug}`);

export const getAppsByCategory = async (
  category: string,
  page = 1
): Promise<CategoryAppsResponse> =>
  fetchGet(`/apps/category/${category}`, { params: { page } });

export const getAllAppsBySearch = async (
  keyword: string,
  page = 1
): Promise<SearchAppsResponse> =>
  fetchGet('/apps/searchable-all-apps', { params: { search: keyword, page } });

export const getAppsByDeveloper = async (
  developer: string
): Promise<DeveloperAppsResponse> => fetchGet(`/apps/developer/${developer}`);

export const getDownloadAppsBySlug = async (
  slug: string
): Promise<DownloadAppResponse> => fetchGet(`/apps/download/${slug}`);

export const getAppsBySearchKeyword = async (
  keyword: string
): Promise<InputSearchAppsResponse> =>
  fetchGet('/apps/searchable', { params: { search: keyword } });
