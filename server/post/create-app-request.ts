'use server';

import { fetchPostApi } from '@/utils/fetch-post-api';

import { UserAppRequestPayload } from '@/lib/schemas';

export async function createAppRequest(data: UserAppRequestPayload) {
  return fetchPostApi<UserAppRequestPayload>(
    '/user-app-requests',
    'POST',
    data
  );
}
