'use server';

import { EnumPlatformType } from '@/types/types.app';
import {
  AppDetailsResponse,
  CategoryAppsResponse,
  DeveloperAppsResponse,
  DownloadAppResponse,
  HomeAppsResponse,
  InputSearchAppsResponse,
  SearchAppsResponse,
} from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getHomeApps = async (
  platform?: EnumPlatformType
): Promise<HomeAppsResponse> =>
  fetchApi(
    platform
      ? `/apps/home-page-apps?platform=${platform}`
      : `/apps/home-page-apps`
  );

export const getAppDetailsBySlug = async (
  slug: string
): Promise<AppDetailsResponse> => fetchApi(`/apps/slug/${slug}`);

export const getAppsByCategory = async (
  category: string,
  page = 1
): Promise<CategoryAppsResponse> =>
  fetchApi(`/apps/category/${category}?page=${page}`);

export const getAllAppsBySearch = async (
  keyword: string,
  page = 1
): Promise<SearchAppsResponse> =>
  fetchApi(`/apps/searchable-all-apps?search=${keyword}&page=${page}`);

export const getAppsByDeveloper = async (
  developer: string
): Promise<DeveloperAppsResponse> => fetchApi(`/apps/developer/${developer}`);

export const getDownloadAppsBySlug = async (
  slug: string
): Promise<DownloadAppResponse> => fetchApi(`/apps/download/${slug}`);

export const getAppsBySearchKeyword = async (
  keyword: string
): Promise<InputSearchAppsResponse> =>
  fetchApi(`/apps/searchable?search=${keyword}`);
