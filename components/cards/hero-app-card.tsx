// components/cards/hero-app-card.tsx
//
// Migrated from AppBody → HomeAppItem.
//
// Structural changes:
//   - Import type: AppBody → HomeAppItem
//   - Routing:     /app/${app.id} → /app/${app.slug}
//   - `badge` prop: removed — HomeAppItem has no badge field and the badge UI
//     was already commented out. Keeping the prop would be a dead API.
//   - app.header_image: was string|null|undefined (required fallback), now
//     string (always present) — fallback kept for defensive safety.
//   - app.name: unchanged.
//   - AppCardInfo: receives HomeAppItem directly — no adapter needed.
import { CSSProperties } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { HomeAppItem, Settings } from '@/types/home-apps.types';

import HomeAppCardInfo from './home-app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroAppCardProps {
  app: HomeAppItem;
  priority?: boolean;
  settings?: Settings<unknown>[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroAppCard({
  app,
  priority = false,
  settings,
}: HeroAppCardProps): React.JSX.Element {
  return (
    // `slug` replaces `id` as the canonical URL segment in HomeAppItem
    <Link href={`/apps/${app.slug}`} className='glass-card-effect-wrapper'>
      {/* Content Area */}
      <button className='glass-card'>
        {/* Banner Image */}
        <div className='relative h-84 overflow-hidden!'>
          <Image
            // header_image is now a required non-null string on HomeAppItem;
            // fallback retained for defensive robustness.
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
          {/* <div className='absolute inset-0 bg-linear-to-t from-background/30 via-background/10 to-transparent' /> */}

          {/* Badges — UI intentionally commented out until design is finalised */}
          {/* {badge && (
              <div className='absolute top-4 left-4 z-10'>
                <Badge className='bg-primary text-primary-foreground shadow-lg border-0'>
                  {badge}
                </Badge>
              </div>
            )} */}
        </div>

        <div
          // style={
          //   {
          //     '--glass-border-radius': '24px',
          //   } as CSSProperties
          // }
          style={{
            borderRadius:
              '0 0 var(--glass-border-radius) var(--glass-border-radius)',
          }}
          className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/90 to-background/80'
        >
          <HomeAppCardInfo app={app} settings={settings} className='p-2' />
        </div>
      </button>

      {/* Shadow */}
      <div className='glass-card-shadow'></div>
    </Link>
  );
}
