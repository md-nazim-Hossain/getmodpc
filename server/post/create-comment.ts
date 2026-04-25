'use server';

import type { ApiVoidResponse } from '@/types/types.response';
import { fetchPost } from '@/utils/apiClient';

import type { CommentPayload } from '@/lib/schemas';

export const createComment = async (
  data: CommentPayload
): Promise<ApiVoidResponse> =>
  fetchPost<ApiVoidResponse, CommentPayload>('/comments', data);
