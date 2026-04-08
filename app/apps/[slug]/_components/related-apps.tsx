'use client';

import { AppCard } from '@/components/cards/app-card';
import { Card } from '@/components/ui/card';

import { AppBody } from '@/lib/types.app';

interface RelatedAppsProps {
  apps: AppBody[];
}

export function RelatedApps({ apps }: RelatedAppsProps) {
  return (
    <Card className='bg-transparent border border-none rounded-none overflow-hidden shadow-none'>
      <div className='pb-4  '>
        <h3 className='text-2xl font-bold  tracking-wider'>Apps · Related</h3>
      </div>
      <div className='space-y-4 pb-8'>
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </Card>
  );
}
