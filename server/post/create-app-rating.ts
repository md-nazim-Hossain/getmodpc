'use server';

import type { AppRatingResponse } from '@/types/types.response';
import { fetchPut } from '@/utils/apiClient';

export const createAppRating = async (
  appId: string
): Promise<AppRatingResponse> =>
  fetchPut<AppRatingResponse>(`/apps/given-rating/${appId}`);
