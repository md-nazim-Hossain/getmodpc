'use server';

import { ApiResponse } from '@/types';
import { HomeAppsResponse } from '@/types/home-apps.types';
import { AppWithSlug } from '@/types/types.app';
import fetchApi from '@/utils/fetch-api';

export const getHomeApps = async (): Promise<HomeAppsResponse> =>
  fetchApi(`/apps/home-page-apps`);

export const getAppBySlug = async (
  slug: string
): Promise<ApiResponse<AppWithSlug>> => fetchApi(`/apps/slug/${slug}`);
