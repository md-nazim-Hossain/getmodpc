'use server';

import type { GlobalSettingsResponse } from '@/types/types.response';
import { fetchGet } from '@/utils/apiClient';

export const getGlobalSettings = async (): Promise<GlobalSettingsResponse> =>
  fetchGet('/settings/get-setting-by-keys', {
    params: { keys: 'seo,system_settings,footer,social_links' },
  });
