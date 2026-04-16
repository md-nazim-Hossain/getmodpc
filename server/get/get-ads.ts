'use server';

import { Ad, ApiResponse } from '@/types';
import fetchApi from '@/utils/fetch-api';

export const getADs = async (): Promise<ApiResponse<Ad[]>> => fetchApi(`/ads`);
