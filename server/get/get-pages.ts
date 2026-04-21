'use server';

import { PageResponse } from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getPagesBySlug = async (slug: string): Promise<PageResponse> =>
  fetchApi(`/pages/slug/${slug}`);
