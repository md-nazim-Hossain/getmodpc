// components/layout/section-header.tsx
// ✅ No 'use client' — removed. Uses only Link and Button which are server-compatible.
// Previously marked 'use client' with zero client-side logic, unnecessarily shipping JS.

import Link from 'next/link';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
  align?: 'left' | 'center';
  /**
   * Pass an id to wire up aria-labelledby on the parent <section>.
   * Example: <section aria-labelledby="section-heading-popular-apps">
   *            <SectionHeader id="section-heading-popular-apps" ... />
   */
  id?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  className,
  align = 'left',
  id,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4',
        align === 'center' && 'text-center items-center',
        className,
      )}
    >
      <div>
        <h2
          id={id}
          className='text-2xl md:text-3xl font-bold text-foreground tracking-tight'
        >
          {title}
        </h2>
        {subtitle && (
          <p className='mt-1 text-muted-foreground text-sm md:text-base'>
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        // ✅ 'group' moved to the Link — was missing entirely.
        // 'group-hover:translate-x-1' on the SVG inside was dead because no
        // ancestor had the 'group' class. The arrow never animated.
        <Link href={viewAllLink} className='group shrink-0 cursor-pointer'>
          <Button variant='glassPrimary'>
            {viewAllText}
            <svg
              className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </Button>
        </Link>
      )}
    </div>
  );
}
