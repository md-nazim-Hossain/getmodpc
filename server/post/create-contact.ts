'use server';

import type { ApiVoidResponse } from '@/types/types.response';
import { fetchPost } from '@/utils/apiClient';

import type { ContactFormValues } from '@/lib/schemas';

export const createContact = async (
  data: ContactFormValues
): Promise<ApiVoidResponse> =>
  fetchPost<ApiVoidResponse, ContactFormValues>('/contacts', data);
