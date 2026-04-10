// app/(home)/_components/home-section.tsx
import React from 'react';

import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';

import { SECTION_HEADERS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionHeaderKey = keyof typeof SECTION_HEADERS;

// 'tinted' applies the alternating gradient used on all "games" sections and
// new-release sections — centralises what was 4 separate copy-pasted class strings.
type SectionVariant = 'default' | 'tinted';

interface HomeSectionProps<T> {
  /** Maps to a key in SECTION_HEADERS — single source of truth for copy */
  headerKey: SectionHeaderKey;
  /** The data array. Items must have a stable `id` for React keying. */
  items: T[];
  /**
   * Render prop — typed against T, so AppCard receives App and CategoryCard
   * receives Category with zero casting or `any`.
   */
  renderItem: (item: T) => React.ReactNode;
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

// Single source of truth for the grid — was duplicated verbatim across 8 files.
const DEFAULT_GRID_CLASS = cn(
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
);

// ─── Component ────────────────────────────────────────────────────────────────
// OCP: add a new section type by adding JSX in page.tsx — no new files needed.
// SRP: renders ONE section template. Config is the only variation.
// Generic T: fully type-safe for both App and Category without casting.

export function HomeSection<T>({
  headerKey,
  items,
  renderItem,
  variant = 'default',
  gridClassName = DEFAULT_GRID_CLASS,
  wrapperClassName = '',
  className,
}: HomeSectionProps<T>): React.JSX.Element | null {
  // Empty-state guard — previously all 8 sections would render an orphaned
  // SectionHeader above an empty grid when data was unavailable.
  if (items.length === 0) return null;

  const header = SECTION_HEADERS[headerKey];
  // Stable, predictable ID for aria-labelledby — derived from the config key.
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
            {items.map((item, index) => (
              // React.Fragment preserves the key on the render prop's root element.
              <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
