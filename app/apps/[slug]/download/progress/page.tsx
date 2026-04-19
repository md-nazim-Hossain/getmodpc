import { getDownloadAppsBySlug } from '@/server/get/get-apps';
import { createDownloadApk } from '@/server/post/create-download-apk';

// adjust import path

import AppProgressContent from '../_components/app-progress-content';

interface PageProps {
  searchParams?: Promise<{ app_slug: string; link_id: string }>;
}

export default async function AppProgressPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const app_slug = decodeURIComponent(search?.app_slug ?? '');
  const link_id = decodeURIComponent(search?.link_id ?? '');

  // Fire both in parallel — no waterfall
  const [downloadRes, appRes] = await Promise.allSettled([
    createDownloadApk({ app_slug, link_id }),
    getDownloadAppsBySlug(app_slug),
  ]);

  if (downloadRes.status === 'rejected') throw downloadRes.reason;

  const { token, size } = downloadRes.value.data;
  const appDetails = appRes.status === 'fulfilled' ? appRes.value.data : null;

  return (
    <AppProgressContent
      token={token}
      fileSize={size}
      appName={appDetails?.name}
      appIcon={appDetails?.icon}
    />
  );
}
