'use server';

import { fetchPostApi } from '@/utils/fetch-post-api';

import { CommentPayload } from '@/lib/schemas';

export async function createComment(data: CommentPayload) {
  return fetchPostApi<CommentPayload>(`/comments`, 'POST', data);
}
