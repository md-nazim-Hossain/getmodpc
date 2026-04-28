'use client';

// components/ads/ads-section.tsx
//
// Refactor: shadcn Carousel → responsive CSS grid
//
// Changes:
//   - Removed: Carousel, CarouselContent, CarouselItem, embla-carousel-autoplay
//   - Added: Tailwind grid layout (1 → 2 → 3 → 5 cols across breakpoints)
//   - Each card wrapped in Next.js <Link> for full-card click
//   - Filtered to active ads only (unchanged)
//   - Card UI: UNCHANGED
import * as React from 'react';

import Link from 'next/link';

import { Ad } from '@/types/ads';

import AdCard from '@/components/cards/ad-card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdsSectionProps {
  heading?: string;
  ads: Ad[];
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdsSection: React.FC<AdsSectionProps> = ({ heading, ads }) => {
  const activeAds = React.useMemo(
    () => ads.filter((ad) => ad.is_active),
    [ads]
  );

  if (!activeAds.length) return null;

  return (
    <section
      aria-label={heading ?? 'Promoted content'}
      className='w-full section-spacing'
    >
      {heading && (
        <div className='px-4 sm:px-6 mb-4'>
          <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400'>
            {heading}
          </h2>
        </div>
      )}

      <div className='px-4 sm:px-6 lg:px-8'>
        <div
          className='
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
          '
        >
          {activeAds.map((ad) => (
            <Link
              key={ad.id}
              href={ad.cta_url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={ad.title || 'View ad'}
              className='block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4EE8] focus-visible:ring-offset-2 rounded-2xl'
            >
              <AdCard ad={ad} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdsSection;
