import { GlobalSettingsResponse } from '@/types/types.response';
import fetchApi from '@/utils/fetch-api';

export const getGlobalSettings = async (): Promise<GlobalSettingsResponse> =>
  fetchApi(
    `/settings/get-setting-by-keys?keys=seo,system_settings,footer,social_links`
  );
