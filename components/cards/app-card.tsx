'use client';

import Link from 'next/link';

import { AppDetails } from '@/types/types.app';

import { cn } from '@/lib/utils';

import AppCardInfo from './app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppCardProps {
  app: AppDetails;
  className?: string;
  showVersion?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppCard({ app, className }: AppCardProps): React.JSX.Element {
  return (
    <Link
      href={`/apps/${app.id}`}
      className={cn('glass-card-effect-wrapper', className)}
    >
      <button className='glass-card'>
        <AppCardInfo app={app} />
      </button>
      <div className='glass-card-shadow'></div>
    </Link>
  );
}
