import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
    <Link href={`/app/${app.id}`} className='block h-full'>
      <Card className={cn('glass-card-wrapper')}>
        {/* Content Area */}
        <CardContent className='glass-card p-0!'>
          {/* Banner Image */}
          <div className='relative h-50 overflow-hidden'>
            <Image
              src={app.banner}
              alt={app.title}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-110'
              style={{
                borderRadius:
                  'var(--test-border-radius) var(--test-border-radius) 0 0',
              }}
              sizes='(max-width: 768px) 100vw, 50vw'
              // ✅ priority is now controlled by the parent — only index 0 gets true.
              // All other slides lazy-load, preventing 6+ simultaneous preload requests.
              priority={priority}
            />
            <div className='absolute inset-0 bg-linear-to-t from-background/30 via-background/10 to-transparent' />

            {/* Badges */}
            {badge && (
              <div className='absolute top-4 left-4 z-10'>
                <Badge className='bg-primary text-primary-foreground shadow-lg border-0'>
                  {badge}
                </Badge>
              </div>
            )}
          </div>
          <div className='p-3'>
            <AppCardInfo app={app} />
          </div>
        </CardContent>
        <div className='glass-card-shadow'></div>
      </Card>
    </Link>
  );
}
