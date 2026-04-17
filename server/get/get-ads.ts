'use server';

import { AdResponse } from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getADs = async (): Promise<AdResponse> => fetchApi(`/ads`);
