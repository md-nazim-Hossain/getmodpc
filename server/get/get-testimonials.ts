'use server';

import type { ActiveTestimonialResponse } from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getActiveTestimonials =
  async (): Promise<ActiveTestimonialResponse> =>
    fetchGet('/testimonials/active');
