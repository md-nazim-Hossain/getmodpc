import Image from 'next/image';
import Link from 'next/link';

import { AppBody } from '@/types/types.app';

import AppCardInfo from './app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroAppCardProps {
  app: AppBody;
  badge?: string;
  priority?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroAppCard({
  app,
  priority = false,
}: HeroAppCardProps): React.JSX.Element {
  return (
    <Link href={`/app/${app.id}`} className='glass-card-effect-wrapper'>
      {/* Content Area */}
      <button className='glass-card'>
        {/* Banner Image */}
        <div className='relative h-80 overflow-hidden!'>
          <Image
            src={app.header_image ?? '/placeholder.png'}
            alt={app.name}
            fill
            className='object-cover transition-transform duration-700'
            style={{
              borderRadius: 'var(--glass-border-radius)',
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
        <div
          style={{
            borderRadius: '0 0 var(--glass-border-radius)',
          }}
          className='absolute bottom-0 left-0 right-0  bg-linear-to-t from-background via-background/90 to-background/80 '
        >
          <AppCardInfo app={app} className='p-2' />
        </div>
      </button>

      {/* Shadow */}
      <div className='glass-card-shadow'></div>
    </Link>
  );
}
