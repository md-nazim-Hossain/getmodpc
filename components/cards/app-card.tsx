import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { App } from '@/lib/types';
import { cn, formatDownloads } from '@/lib/utils';
import { PlatformIconList } from '../platform-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppCardProps {
  app: App;
  className?: string;
  showVersion?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppCard({
  app,
  className,
  showVersion,
}: AppCardProps): React.JSX.Element {
  return (
    <Link href={`/app/${app.id}`} className='block h-full'>
      <div className={cn('glass-card-wrapper', className)}>
        <div className='glass-card'>
          <div className='flex items-center gap-4'>
            {/* App Icon */}
            <div className='relative size-20 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5'>
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

              {/* ✅ Platform icons extracted — was duplicated verbatim in HeroAppCard */}
              <div className='mt-1'>
                <PlatformIconList platforms={app.platform} size='sm' />
              </div>

              {/* Meta */}
              <div className='flex items-center gap-2 mt-1.5 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <svg
                    className='h-3.5 w-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
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
                    <span aria-hidden='true'>•</span>
                    <span>v{app.version}</span>
                  </>
                )}
              </div>
            </div>

            {/* Premium Badge */}
            {app.isPremium && (
              <Badge className='bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0 shrink-0'>
                PRO
              </Badge>
            )}
          </div>
        </div>

        <div className='glass-card-shadow'></div>
      </div>
    </Link>
  );
}
