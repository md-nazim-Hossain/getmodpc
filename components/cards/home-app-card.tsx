'use client';

// components/cards/app-card.tsx
//
// Migrated from AppBody → HomeAppItem.
//
// Structural changes:
//   - Import type: AppBody → HomeAppItem
//   - Routing:     /apps/${app.id} → /apps/${app.slug}  (slug is now the canonical URL key)
//   - showVersion: now forwarded to AppCardInfo (was declared but silently dropped)
//   - app.id:      was optional (string|undefined), now required (string) — no change needed in JSX
import Link from 'next/link';

import { HomeAppItem, Settings } from '@/types/home-apps.types';

import { cn } from '@/lib/utils';

import HomeAppCardInfo from './home-app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppCardProps {
  app: HomeAppItem;
  settings?: Settings<unknown>[];
  className?: string;
  showVersion?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeAppCard({
  app,
  className,
  showVersion = true,
  settings,
}: AppCardProps): React.JSX.Element {
  return (
    <Link
      // `slug` replaces `id` as the canonical URL segment in HomeAppItem
      href={`/apps/${app.slug}`}
      className={cn('glass-card-effect-wrapper', className)}
    >
      <button className='glass-card'>
        <HomeAppCardInfo
          app={app}
          showVersion={showVersion}
          settings={settings}
        />
      </button>
      <div className='glass-card-shadow'></div>
    </Link>
  );
}
