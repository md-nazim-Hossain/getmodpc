'use server';

import { HomeAppsResponse } from '@/types/home-apps.types';
import fetchApi from '@/utils/fetch-api';

export const getHomeApps = async (): Promise<HomeAppsResponse> =>
  fetchApi(`/apps/home-page-apps`);
