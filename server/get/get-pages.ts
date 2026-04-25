'use server';

import type { PageResponse } from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getPagesBySlug = async (slug: string): Promise<PageResponse> =>
  fetchGet(`/pages/slug/${slug}`);
