// components/layout/section-header.tsx
// ✅ No 'use client' — removed. Uses only Link and Button which are server-compatible.
// Previously marked 'use client' with zero client-side logic, unnecessarily shipping JS.
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

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
        'mb-4 flex items-end justify-between gap-4',
        align === 'center' && 'text-center items-center',
        className
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
          <Button
            size={'sm'}
            variant='glassPrimary'
            className='rounded-full gap-x-1'
          >
            {viewAllText}
            <ArrowRight className='size-4' />
          </Button>
        </Link>
      )}
    </div>
  );
}
