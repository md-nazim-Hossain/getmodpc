'use server';

import { ActiveTestimonialResponse } from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getActiveTestimonials =
  async (): Promise<ActiveTestimonialResponse> =>
    fetchApi(`/testimonials/active`);
