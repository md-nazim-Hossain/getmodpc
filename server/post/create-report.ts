'use server';

import { fetchPostApi } from '@/utils/fetch-post-api';

import { ReportAppPayload } from '@/lib/schemas';

export async function createReport(data: ReportAppPayload) {
  return fetchPostApi<ReportAppPayload>(`/reports`, 'POST', data);
}
