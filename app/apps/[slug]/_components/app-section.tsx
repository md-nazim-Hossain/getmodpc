'use client';

import { AppBody } from '@/types/types.app';

import { AppCard } from '@/components/cards/app-card';

interface AppSectionProps {
  title: string;
  apps: AppBody[];
}

export function AppSection({ title, apps }: AppSectionProps) {
  return (
    <section className='mt-10'>
      <h2 className='text-2xl font-bold mb-4'>{title}</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4'>
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
