import { secret } from '@/config/secret';

export default async function fetchApi<Response>(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(secret.apiBaseUrl + url, {
    ...options,
    cache: 'default',
    next: {
      revalidate: 0,
    },
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    console.log({ res });
    throw new Error(res.statusText + ' - ' + res.url);
  }

  return await res.json();
}
