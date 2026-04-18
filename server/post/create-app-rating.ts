'use server';

import { AppRatingResponse } from '@/types/types.response';
import { fetchPostApi } from '@/utils/fetch-post-api';

export async function createAppRating(
  appId: string
): Promise<AppRatingResponse> {
  return fetchPostApi<AppRatingResponse>(`/apps/given-rating/${appId}`, 'PUT');
}
