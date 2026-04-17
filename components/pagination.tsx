'use client';

import React, { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PaginationMeta } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_VISIBLE = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= MAX_VISIBLE)
    return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(MAX_VISIBLE / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + MAX_VISIBLE - 1);
  start = Math.max(1, end - MAX_VISIBLE + 1);

  const pages: (number | '...')[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total) {
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }
  return pages;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Pagination: React.FC<PaginationMeta> = ({
  page,
  limit,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));
      params.set('limit', String(limit));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, limit]
  );

  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-center gap-1.5 py-6 select-none flex-wrap'
    >
      {/* Prev */}
      <PaginationButton
        onClick={() => navigate(page - 1)}
        disabled={!hasPreviousPage}
        aria-label='Previous page'
        className='px-2'
      >
        <ChevronLeft className='size-4' />
      </PaginationButton>

      {/* Pages */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className='flex items-center justify-center w-10 h-10 text-sm text-muted-foreground'
            aria-hidden
          >
            …
          </span>
        ) : (
          <PaginationButton
            key={p}
            onClick={() => navigate(p as number)}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </PaginationButton>
        )
      )}

      {/* Next */}
      <PaginationButton
        onClick={() => navigate(page + 1)}
        disabled={!hasNextPage}
        aria-label='Next page'
        className='px-2'
      >
        <ChevronRight className='size-4' />
      </PaginationButton>
    </nav>
  );
};

// ─── Sub-component ────────────────────────────────────────────────────────────

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  active,
  disabled,
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled}
    className={cn(
      'flex items-center justify-center min-w-10 h-10 rounded-xl text-sm font-semibold border transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      active
        ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
        : 'bg-background border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5',
      disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      className
    )}
  >
    {children}
  </button>
);

export default Pagination;
