// components/layout/section-header.tsx
// ✅ No 'use client' — removed. Uses only Link and Button which are server-compatible.
// Previously marked 'use client' with zero client-side logic, unnecessarily shipping JS.
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { GlassButton } from '../glass-button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  titleClassName?: string;
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
  titleClassName,
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
        'mb-4 flex items-end justify-between gap-4 ',
        align === 'center' && 'text-center items-center',
        className
      )}
    >
      <div>
        <h2
          id={id}
          className={cn(
            'text-2xl md:text-[1.75rem] font-bold text-foreground tracking-tight',
            titleClassName
          )}
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

        <GlassButton
          href={viewAllLink}
          label={viewAllText}
          icon={<ArrowRight />}
          borderRadius='999px'
          variant='custom'
        />
        // <Link
        //   href={viewAllLink}
        //   className='group  shrink-0 cursor-pointer block'
        // >

        //   {/* <GlassButton childrenClassName='xl:px-6! xl:py-3! text-sm'>
        //     {viewAllText}
        //     <ArrowRight className='size-4' />
        //   </GlassButton> */}
        //   {/* <Button
        //     size={'sm'}
        //     variant='glassPrimary'
        //     className='rounded-full gap-x-1'
        //   >
        //     {viewAllText}
        //     <ArrowRight className='size-4' />
        //   </Button> */}
        // </Link>
      )}
    </div>
  );
}
