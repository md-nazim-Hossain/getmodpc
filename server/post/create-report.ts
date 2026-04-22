'use server';

import type { ApiVoidResponse } from '@/types/types.response';
import { fetchPost } from '@/utils/apiClient';

import type { ReportAppPayload } from '@/lib/schemas';

export const createReport = async (
  data: ReportAppPayload
): Promise<ApiVoidResponse> =>
  fetchPost<ApiVoidResponse, ReportAppPayload>('/reports', data);
