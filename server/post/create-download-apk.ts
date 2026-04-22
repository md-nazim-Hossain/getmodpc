'use server';

import type { DownloadApkResponse } from '@/types/types.response';
import { fetchPost } from '@/utils/apiClient';

type CreateDownloadApkPayload = {
  link_id: string;
  app_slug: string;
};

export const createDownloadApk = async (
  data: CreateDownloadApkPayload
): Promise<DownloadApkResponse> =>
  fetchPost<DownloadApkResponse, CreateDownloadApkPayload>(
    '/downloads/prepare-download-apk',
    data
  );
