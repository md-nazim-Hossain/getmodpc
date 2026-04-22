'use server';

import type { ReportReasonResponse } from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getActiveReportReasons = async (): Promise<ReportReasonResponse> =>
  fetchGet('/report-reasons/active');
