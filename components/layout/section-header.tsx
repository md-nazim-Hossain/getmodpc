'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4',
        align === 'center' && 'text-center items-center',
        className,
      )}
    >
      <div>
        <h2 className='text-2xl md:text-3xl font-bold text-foreground tracking-tight'>
          {title}
        </h2>
        {subtitle && (
          <p className='mt-1 text-muted-foreground text-sm md:text-base'>
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link href={viewAllLink} className='cursor-pointer'>
          <Button variant='glassPrimary' className='shrink-0  cursor-pointer'>
            {viewAllText}

            <svg
              className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth={2}
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
