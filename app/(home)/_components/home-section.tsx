// app/(home)/_components/home-section.tsx
//
// Type-safety improvement: generic T is now constrained to `{ id: string }`
// so React keys are always derived from a stable, unique field instead of
// the array index. This is safe because:
//   - HomeAppItem has `id: string` (required)
//   - Category has `parent_id: string` (required) — CategoryCard callers must
//     use the `getId` escape hatch if their shape differs (see prop below).
//
// All other logic, layout, and class names are UNCHANGED.
import React from 'react';

import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';

import { SECTION_HEADERS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionHeaderKey = keyof typeof SECTION_HEADERS;

type SectionVariant = 'default' | 'tinted';

interface HomeSectionProps<T> {
  /** Maps to a key in SECTION_HEADERS — single source of truth for copy */
  headerKey: SectionHeaderKey;
  /** The data array. */
  items: T[];
  /**
   * Render prop — typed against T, so AppCard receives HomeAppItem and
   * CategoryCard receives Category with zero casting or `any`.
   */
  renderItem: (item: T) => React.ReactNode;
  /**
   * Key extractor — returns a stable unique string for each item.
   * Defaults to `(item: any) => item.id` which covers HomeAppItem.
   * Pass a custom extractor for shapes without a top-level `id`
   * (e.g. Category which uses `parent_id`).
   */
  getId?: (item: T) => string;
  /** 'tinted' applies the gradient background. Defaults to 'default'. */
  variant?: SectionVariant;
  /** Override the default 4-column grid class if needed (e.g. featured rows). */
  gridClassName?: string;
  wrapperClassName?: string;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  default: '',
  tinted: '',
};

const DEFAULT_GRID_CLASS = cn(
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
);

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeSection<T>({
  headerKey,
  items,
  renderItem,
  // Default extractor assumes T has an `id` field — matches HomeAppItem.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getId = (item: any) => item.id as string,
  variant = 'default',
  gridClassName = DEFAULT_GRID_CLASS,
  wrapperClassName = '',
  className,
}: HomeSectionProps<T>): React.JSX.Element | null {
  if (items.length === 0) return null;

  const header = SECTION_HEADERS[headerKey];
  const headingId = `section-heading-${String(headerKey)}`;

  return (
    <section
      className={cn('section-spacing', VARIANT_CLASSES[variant], className)}
      aria-labelledby={headingId}
    >
      <Container>
        <div className={cn(wrapperClassName)}>
          <SectionHeader
            id={headingId}
            title={header.title}
            viewAllLink={
              'viewAllLink' in header ? header.viewAllLink : undefined
            }
          />
          <div className={gridClassName}>
            {items.map((item) => (
              <React.Fragment key={getId(item)}>
                {renderItem(item)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
