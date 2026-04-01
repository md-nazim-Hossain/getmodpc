import Image from 'next/image';
import Link from 'next/link';

import { App } from '@/lib/types';
import { cn } from '@/lib/utils';

import AppCardInfo from './app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroAppCardProps {
  app: App;
  badge?: string;
  priority?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroAppCard({
  app,
  badge,
  priority = false,
}: HeroAppCardProps): React.JSX.Element {
  return (
    <Link href={`/app/${app.id}`} className='glass-card-effect block'>
      <div className={cn('glass-card-effect-wrapper')}>
        {/* Content Area */}
        <button className='glass-card'>
          {/* Banner Image */}
          <div className='relative h-50 overflow-hidden'>
            <Image
              src={app.banner}
              alt={app.title}
              fill
              className='object-cover transition-transform duration-700'
              style={{
                borderRadius:
                  'var(--glass-border-radius) var(--glass-border-radius) 0 0',
              }}
              sizes='(max-width: 768px) 100vw, 50vw'
              priority={priority}
            />
            <div className='absolute inset-0 bg-linear-to-t from-background/30 via-background/10 to-transparent' />

            {/* Badges */}
            {/* {badge && (
              <div className='absolute top-4 left-4 z-10'>
                <Badge className='bg-primary text-primary-foreground shadow-lg border-0'>
                  {badge}
                </Badge>
              </div>
            )} */}
          </div>
          <AppCardInfo app={app} className='p-5' />
        </button>
      </div>
    </Link>
  );
}
