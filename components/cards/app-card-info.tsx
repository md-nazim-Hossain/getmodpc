// components/app/AppCardInfo.tsx
//
// Refactored to use the new AppBody type from lib/types.
//
// Field mapping (old App → new AppBody):
//   app.title      → app.name          (display name)
//   app.icon       → app.icon          (same field, now string | null)
//   app.isVerified → app.is_verified   (snake_case)
//   app.platform   → app.platform      (now EnumPlatformType enum)
//   app.downloads  → app.installs      (string, e.g. "50,000,000+")
//   app.version    → app.version       (same, now string | null)
//   app.extraInfo  → app.short_mode    (mod label, e.g. "Premium Unlocked")
//
// UI: UNCHANGED — same layout, same classes, same icon SVGs.
import Image from 'next/image';

import { AppDetails } from '@/types/types.app';

import { cn } from '@/lib/utils';

import { PlatformIconList } from '../platform-icon';
import { CardTitle } from '../ui/card';

/**
 * AppCardInfo now accepts the full AppBody shape.
 * Only the data-access layer changed; the rendered output is identical.
 */
const AppCardInfo: React.FC<{ app: AppDetails; className?: string }> = ({
  app,
  className,
}) => {
  return (
    <div className={cn('flex gap-4 p-2', className)}>
      {/* App Icon */}
      <div className='relative size-21 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5'>
        {app.icon && (
          <Image
            src={app.icon}
            alt={`${app.name} icon`} // was: app.title
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-110'
            sizes='56px'
          />
        )}
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0 p-0'>
        <CardTitle className='text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-x-1.5'>
          {app.name} {/* was: app.title */}
          {/* Verified Icon */}
          {app.is_verified /* was: app.isVerified */ && (
            <Image
              src='/icons/check.svg'
              alt='Verified'
              width={14}
              height={14}
            />
          )}
        </CardTitle>

        {/* Meta */}
        <div className='flex flex-col gap-y-0.75 mt-1 text-xs text-foreground'>
          {/* Platform icons — PlatformIconList already accepts Platform ('android'|'windows'|'apple')
              The new EnumPlatformType values are identical strings, so no adapter is needed. */}
          <PlatformIconList platform={app.platform!} size='sm' />

          {/* Installs row — was: formatDownloads(app.downloads, app.version) */}
          <span className='flex items-center gap-2'>
            <div className='size-3.5'>
              <svg className='size-3.5' viewBox='0 0 24 24' fill='currentColor'>
                <g transform='scale(0.0416667 0.046875)'>
                  <path d='M567.938 243.908L462.25 85.374A48.003 48.003 0 0 0 422.311 64H153.689a48 48 0 0 0-39.938 21.374L8.062 243.908A47.994 47.994 0 0 0 0 270.533V400c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V270.533a47.994 47.994 0 0 0-8.062-26.625zM162.252 128h251.497l85.333 128H376l-32 64H232l-32-64H76.918l85.334-128z' />
                </g>
              </svg>
            </div>
            {/* installs is a pre-formatted string in AppBody ("50,000,000+") */}
            <span className='text-muted-foreground'>
              {app.installs}
              {app.version ? ` • v${app.version}` : ''}
            </span>
          </span>

          {/* Mod info row — was: always "Premium Unlocked", now app.short_mode */}
          {app.short_mode && (
            <span className='flex items-center gap-2'>
              <div className='size-3.5 overflow-hidden'>
                <svg
                  className='size-3.5'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <g transform='scale(0.046875)'>
                    <path d='M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z' />
                  </g>
                </svg>
              </div>
              <span className='text-muted-foreground'>{app.short_mode}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppCardInfo;
