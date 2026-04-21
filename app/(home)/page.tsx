import { redirect } from 'next/navigation';

import { getHomeApps } from '@/server/get/get-apps';

import HomePageContent from './_components/home-page-content';

export default async function HomePage() {
  const appData = await getHomeApps();

  if (!appData || !appData.success || !appData.data) {
    redirect('/404');
  }

  return <HomePageContent data={appData.data} />;
}
