// components/cards/category-card.tsx
// ✅ No 'use client' — Link and Card are server-compatible.
import { CSSProperties } from 'react';

import Link from 'next/link';

import { Category } from '@/types/home-apps.types';

import { cn } from '@/lib/utils';

// ─── Icon map ─────────────────────────────────────────────────────────────────
// Add a full mapping here per category.icon value from your data.
// The dev warning below will surface any unmapped icons during development.

const ICON_MAP: Record<string, React.JSX.Element> = {
  palette: (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
      />
    </svg>
  ),
  // Add remaining icons here — e.g., 'gaming', 'productivity', 'social', etc.
};

const FALLBACK_ICON: React.JSX.Element = (
  <svg
    className='h-5 w-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    />
  </svg>
);

const COLOR_MAP: Record<string, string> = {
  palette: '#87CEEB',
};

// make the color random
const FALLBACK_COLOR = function () {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function getIconColor(key: string): {
  icon: React.JSX.Element;
  color: string;
} {
  const icon = ICON_MAP[key];
  const color = COLOR_MAP[key];
  if (!icon && !color) {
    // ✅ Surfaces unmapped icons during development — was silently falling back
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CategoryCard] Unmapped icon or color for key: ${key}`);
    }
    return {
      icon: FALLBACK_ICON,
      color: FALLBACK_COLOR(),
    };
  }

  return {
    icon: icon || FALLBACK_ICON,
    color: color || FALLBACK_COLOR(),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryCardProps {
  category: Category;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryCard({
  category,
  className,
}: CategoryCardProps): React.JSX.Element {
  const { icon, color } = getIconColor(category.parent_name);

  return (
    <Link
      href={`/category/${category.parent_id}`}
      className={cn('glass-card-effect-wrapper', className)}
      style={
        {
          '--glass-border-radius': '12px',
        } as CSSProperties
      }
    >
      <button
        className={'glass-card'}
        style={
          {
            '--glass-border-radius': '12px',
          } as CSSProperties
        }
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
          }}
          className='flex items-center justify-between gap-3 rounded-[12px] p-4'
        >
          <div className='min-w-0 flex-1 self-center'>
            <h5 className='text-xs leading-tight font-medium text-foreground transition-colors group-hover:text-primary'>
              {category.parent_name}
            </h5>
            {/* {category.count != null && (
              <p className='text-sm text-muted-foreground mt-0.5'>
                {category.count} apps
              </p>
            )} */}
          </div>

          {/* Icon Container */}
          <div
            className='flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6'
            style={{ backgroundColor: `${color}70` }}
            aria-hidden='true'
          >
            <span className='text-neutral-700'>{icon}</span>
          </div>
        </div>
      </button>
      <div className='glass-card-shadow'></div>
    </Link>
  );
}
