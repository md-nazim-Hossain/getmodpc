import './env-config';

export const secret = {
  apiBaseUrl: process.env.API_BASE_URL!,
  webBaseUrl: process.env.WEB_BASE_URL!,
};
