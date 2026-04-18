'use server';

import { secret } from '@/config/secret';
import { ApiResponse } from '@/types/types.response';

export async function fetchPostApi<T>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  data?: T
): Promise<ApiResponse<T, unknown>> {
  try {
    const res = await fetch(`${secret.apiBaseUrl}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:
        data &&
        JSON.stringify({
          ...data,
        }),
    });

    const result: ApiResponse<T, unknown> = await res.json();

    if (result.success === false) throw new Error(result.message);

    return result;
  } catch (err) {
    console.log({ err });
    throw new Error((err as Error).message);
  }
}
