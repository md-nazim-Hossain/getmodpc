'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { App } from '@/lib/types';
import { formatDownloads, cn } from '@/lib/utils';
import { PLATFORM_COLORS } from '@/lib/constants';

interface AppCardProps {
  app: App;
  className?: string;
  showVersion?: boolean;
}

export function AppCard({ app, className, showVersion }: AppCardProps) {
  return (
    <Link href={`/app/${app.id}`} className='block h-full'>
      <Card
        className={cn(
          'group relative h-full overflow-hidden border-0',
          'bg-linear-to-br from-white/80 to-white/50 dark:from-black/40 dark:to-black/20',
          'backdrop-blur-xl border border-white/30 dark:border-white/10',
          'shadow-card transition-all duration-300 ease-out',
          'hover:shadow-card-hover hover:scale-[1.02] hover:border-primary/20',
          className,
        )}
      >
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            {/* App Icon */}
            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5'>
              <Image
                src={app.icon}
                alt={`${app.title} icon`}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-110'
                sizes='56px'
              />
            </div>

            {/* Info */}
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors'>
                {app.title}
              </CardTitle>

              {/* Platform Icons */}
              <div className='flex items-center gap-1.5 mt-1'>
                {app.platform.map((p) => (
                  <span
                    key={p}
                    className='inline-flex items-center justify-center h-5 w-5 rounded-full'
                    style={{ backgroundColor: `${PLATFORM_COLORS[p]}15` }}
                  >
                    {p === 'android' && (
                      <svg
                        className='h-3 w-3'
                        viewBox='0 0 24 24'
                        fill={PLATFORM_COLORS[p]}
                      >
                        <path d='M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.44-.68-3.05-1.06-4.75-1.06s-3.31.38-4.75 1.06L4.59 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L5.34 9.48C3.04 11.07 1.5 13.56 1.5 16.5h21c0-2.94-1.54-5.43-3.84-7.02zM7 14.75c-.69 0-1.25-.56-1.25-1.25S6.31 12.25 7 12.25s1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z' />
                      </svg>
                    )}
                    {p === 'windows' && (
                      <svg
                        className='h-3 w-3'
                        viewBox='0 0 24 24'
                        fill={PLATFORM_COLORS[p]}
                      >
                        <path d='M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z' />
                      </svg>
                    )}
                    {p === 'apple' && (
                      <svg
                        className='h-3 w-3'
                        viewBox='0 0 24 24'
                        fill={PLATFORM_COLORS[p]}
                      >
                        <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                      </svg>
                    )}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className='flex items-center gap-2 mt-1.5 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <svg
                    className='h-3.5 w-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                    />
                  </svg>
                  {formatDownloads(app.downloads)}
                </span>
                {showVersion && app.version && (
                  <>
                    <span>•</span>
                    <span>{app.version}</span>
                  </>
                )}
              </div>
            </div>

            {/* Premium Badge */}
            {app.isPremium && (
              <Badge className='bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0 shrink-0'>
                PRO
              </Badge>
            )}
          </div>

          {/* Status Footer */}
          <div className='mt-3 flex items-center justify-between border-t border-border/30 pt-3'>
            <Badge variant='secondary' className='text-[10px] font-normal'>
              {app.extraInfo}
            </Badge>
            <span className='text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity'>
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
