'use server';

import { ApiResponse, Testimonial } from '@/types';
import fetchApi from '@/utils/fetch-api';

export const getActiveTestimonials = async (): Promise<
  ApiResponse<Testimonial[]>
> => fetchApi(`/testimonials/active`);
