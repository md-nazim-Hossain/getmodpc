'use server';

import type { ApiVoidResponse } from '@/types/types.response';
import { fetchPost } from '@/utils/apiClient';

import type { UserAppRequestPayload } from '@/lib/schemas';

export const createAppRequest = async (
  data: UserAppRequestPayload
): Promise<ApiVoidResponse> =>
  fetchPost<ApiVoidResponse, UserAppRequestPayload>('/user-app-requests', data);
