'use client';

import { HomeAppItem, Settings } from '@/types/home-apps.types';

import { AppCard } from '@/components/cards/app-card';

import { cn } from '@/lib/utils';

interface AppSectionProps {
  title: string;
  apps: HomeAppItem[];
  settings: Settings<unknown>[];
  className?: string;
}

export function AppSection({
  title,
  apps,
  className,
  settings,
}: AppSectionProps) {
  return (
    <section className={cn('mt-10', className)}>
      <h2 className='text-3xl font-bold mb-4'>{title}</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4'>
        {apps.map((app) => (
          <AppCard key={app.id} app={app} settings={settings} />
        ))}
      </div>
    </section>
  );
}
