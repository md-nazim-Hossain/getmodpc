// components/cards/hero-app-card.tsx
// ✅ Renamed from herp-app-card.tsx — was a typo baked into every import path.
// ✅ priority is now a prop — previously ALL slides had priority=true simultaneously.

import { Download, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { App } from '@/lib/types';
import { cn, formatDownloads } from '@/lib/utils';
import { PlatformIconList } from '../platform-icon';

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
      <Card
        className={cn(
          'group relative h-full overflow-hidden min-h-[380px] md:min-h-[420px] border-0',
          'bg-linear-to-br from-white/70 to-white/40 dark:from-black/40 dark:to-black/20',
          'backdrop-blur-xl border border-white/30 dark:border-white/10',
          'shadow-glass transition-all duration-500 ease-out',
          'hover:shadow-glass-hover hover:border-primary/20 hover:scale-[1.01]',
        )}
      >
        {/* Banner Image */}
        <div className='absolute inset-0 h-[55%] overflow-hidden'>
          <Image
            src={app.banner}
            alt={app.title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, 50vw'
            // ✅ priority is now controlled by the parent — only index 0 gets true.
            // All other slides lazy-load, preventing 6+ simultaneous preload requests.
            priority={priority}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent' />

          {/* Badges */}
          {badge && (
            <div className='absolute top-4 left-4 z-10'>
              <Badge className='bg-primary text-primary-foreground shadow-lg border-0'>
                {badge}
              </Badge>
            </div>
          )}
          {app.isPremium && (
            <div className='absolute top-4 right-4 z-10'>
              <Badge
                variant='outline'
                className='bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg'
              >
                Premium
              </Badge>
            </div>
          )}
        </div>

        {/* Floating Icon */}
        <div className='absolute top-[45%] left-6 h-20 w-20 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-background dark:ring-background/50 z-20 transition-transform duration-300 group-hover:scale-105'>
          <Image
            src={app.icon}
            alt={`${app.title} icon`}
            fill
            className='object-cover'
            sizes='80px'
          />
        </div>

        {/* Content Area */}
        <CardContent className='absolute bottom-0 left-0 right-0 h-[55%] pt-16 pb-6 px-6 flex flex-col justify-end'>
          <div className='space-y-3'>
            <div className='flex items-start justify-between gap-2'>
              <CardTitle className='text-xl text-foreground truncate group-hover:text-primary transition-colors'>
                {app.title}
              </CardTitle>

              {app.rating && (
                <div className='flex items-center gap-1 shrink-0 text-sm text-foreground/80 bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm'>
                  <Star
                    className='h-3.5 w-3.5 fill-amber-500 text-amber-500'
                    aria-hidden='true'
                  />
                  <span className='font-medium'>{app.rating}</span>
                </div>
              )}
            </div>

            {/* ✅ Platform icons — extracted, was duplicated verbatim from AppCard */}
            <div className='flex items-center gap-2'>
              <PlatformIconList platforms={app.platform} size='md' />
              <span className='text-sm text-muted-foreground ml-1'>
                {app.category}
              </span>
            </div>

            {/* Meta Footer */}
            <div className='flex items-center justify-between pt-2 border-t border-border/50'>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Download className='h-4 w-4' aria-hidden='true' />
                  {formatDownloads(app.downloads)}
                </span>
              </div>
              <Badge variant='secondary' className='text-xs font-normal'>
                {app.extraInfo}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
