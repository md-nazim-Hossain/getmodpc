'use server';

import { secret } from '@/config/secret';

import { CommentPayload } from '@/lib/schemas';

export async function createComment(data: CommentPayload) {
  const res = await fetch(`${secret.apiBaseUrl}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
    }),
  });

  return await res.json();
}
