'use server';

import { fetchPostApi } from '@/utils/fetch-post-api';

import { ContactFormValues } from '@/lib/schemas';

export async function createContact(data: ContactFormValues) {
  return fetchPostApi<ContactFormValues>(`/contacts`, 'POST', data);
}
