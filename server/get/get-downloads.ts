'use server';

import { fetchGet } from '@/utils/apiClient';

export const getDownloads = async (token: string) =>
  fetchGet(`/downloads`, { params: { token } });
