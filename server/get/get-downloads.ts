import fetchApi from '@/utils/fetch-api';

export const getDownloads = async (token: string) =>
  fetchApi(`/downloads?token=${token}`);
