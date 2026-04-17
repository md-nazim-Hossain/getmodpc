'use server';

import { ApiResponse, ReportReason } from '@/types';
import fetchApi from '@/utils/fetch-api';

export const getActiveReportReasons = async (): Promise<
  ApiResponse<ReportReason[]>
> => fetchApi(`/report-reasons/active`);
