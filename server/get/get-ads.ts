'use server';

import type { AdResponse } from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getADs = async (): Promise<AdResponse> => fetchGet('/ads');
