'use server';

import { secret } from '@/config/secret';
import { AppRatingResponse } from '@/types/types.response';

export async function createAppRating(
  appId: string
): Promise<AppRatingResponse> {
  const res = await fetch(`${secret.apiBaseUrl}/apps/given-rating/${appId}`, {
    method: 'PUT',
  });

  return await res.json();
}
