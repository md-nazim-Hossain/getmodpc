'use server';

import { fetchPostApi } from '@/utils/fetch-post-api';

type CreateDownloadAppPayload = {
  link_id: string;
  app_slug: string;
};

export async function createDownloadApk(data: CreateDownloadAppPayload) {
  return fetchPostApi<{
    token: string;
    size: string;
    type: string;
    name: string;
  }>(`/downloads/prepare-download-apk`, 'POST', data);
}
