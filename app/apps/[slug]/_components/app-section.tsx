'use client';

import { HomeAppItem } from '@/types/home-apps.types';

import { HomeAppCard } from '@/components/cards/home-app-card';

interface AppSectionProps {
  title: string;
  apps: HomeAppItem[];
}

export function AppSection({ title, apps }: AppSectionProps) {
  return (
    <section className='mt-10'>
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4'>
        {apps.map((app) => (
          <HomeAppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
