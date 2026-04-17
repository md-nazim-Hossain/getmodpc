'use server';

import { ReportReasonResponse } from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getActiveReportReasons = async (): Promise<ReportReasonResponse> =>
  fetchApi(`/report-reasons/active`);
