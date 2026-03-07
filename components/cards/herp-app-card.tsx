'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { PLATFORM_COLORS } from '@/lib/constants';
import { App } from '@/lib/types';
import { cn, formatDownloads } from '@/lib/utils';
import { Download, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroAppCardProps {
  app: App;
  badge?: string;
}

export function HeroAppCard({ app, badge }: HeroAppCardProps) {
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
        {/* Banner Image (Absolute Positioned Top Half) */}
        <div className='absolute inset-0 h-[55%] overflow-hidden'>
          <Image
            src={app.banner}
            alt={app.title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
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
                  <Star className='h-3.5 w-3.5 fill-amber-500 text-amber-500' />
                  <span className='font-medium'>{app.rating}</span>
                </div>
              )}
            </div>

            {/* Platform Icons */}
            <div className='flex items-center gap-2'>
              {app.platform.map((p) => (
                <span
                  key={p}
                  className='inline-flex items-center justify-center h-7 w-7 rounded-full bg-secondary/50 dark:bg-secondary/20'
                >
                  {p === 'android' && (
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill={PLATFORM_COLORS[p]}
                    >
                      <path d='M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.44-.68-3.05-1.06-4.75-1.06s-3.31.38-4.75 1.06L4.59 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L5.34 9.48C3.04 11.07 1.5 13.56 1.5 16.5h21c0-2.94-1.54-5.43-3.84-7.02zM7 14.75c-.69 0-1.25-.56-1.25-1.25S6.31 12.25 7 12.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z' />
                    </svg>
                  )}
                  {p === 'windows' && (
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill={PLATFORM_COLORS[p]}
                    >
                      <path d='M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z' />
                    </svg>
                  )}
                  {p === 'apple' && (
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill={PLATFORM_COLORS[p]}
                    >
                      <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                    </svg>
                  )}
                </span>
              ))}
              <span className='text-sm text-muted-foreground ml-2'>
                {app.category}
              </span>
            </div>

            {/* Meta Footer */}
            <div className='flex items-center justify-between pt-2 border-t border-border/50'>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <Download className='h-4 w-4' />
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
