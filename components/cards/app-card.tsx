import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

import { App } from '@/lib/types';
import { cn } from '@/lib/utils';

import AppCardInfo from './app-card-info';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppCardProps {
  app: App;
  className?: string;
  showVersion?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppCard({ app, className }: AppCardProps): React.JSX.Element {
  return (
    <Link href={`/app/${app.id}`} className='block h-full'>
      <Card className={cn('glass-card-wrapper', className)}>
        <CardContent className='glass-card'>
          <AppCardInfo app={app} />
        </CardContent>
        <div className='glass-card-shadow'></div>
      </Card>
    </Link>
  );
}
