'use client';

// components/ads/ads-section.tsx
//
// Migration: Swiper → shadcn Carousel
//
// Changes:
//   - Removed: swiper, swiper/css, swiper/modules, swiper/react
//   - Added: shadcn Carousel + embla-carousel-autoplay (same dep as hero-section)
//   - Behavior preserved: autoplay, loop, responsive slides, prev/next controls
//   - UI/layout: UNCHANGED
import * as React from 'react';

import { Ad } from '@/types/ads';
import Autoplay from 'embla-carousel-autoplay';

import AdCard from '@/components/cards/ad-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdsSectionProps {
  heading?: string;
  ads: Ad[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdsSection: React.FC<AdsSectionProps> = ({
  heading,
  ads,
  autoplay = true,
  autoplayDelay = 4000,
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true })
  );

  // Filter only active ads
  const activeAds = React.useMemo(
    () => ads.filter((ad) => ad.is_active),
    [ads]
  );

  if (!activeAds.length) return null;

  return (
    <section aria-label={heading ?? 'Promoted content'} className='w-full py-6'>
      {heading && (
        <div className='px-4 sm:px-6 mb-4'>
          <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400'>
            {heading}
          </h2>
        </div>
      )}

      <div className='px-4 sm:px-6 lg:px-8'>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={autoplay ? [plugin.current] : []}
          className='w-full'
        >
          <CarouselContent className='-ml-3 sm:-ml-4'>
            {activeAds.map((ad) => (
              <CarouselItem
                key={ad.id}
                className='
                  pl-3 sm:pl-4
                  basis-full
                  sm:basis-1/2
                  lg:basis-1/3
                  xl:basis-1/4
                  2xl:basis-1/5
                '
              >
                <div className='h-full'>
                  <AdCard ad={ad} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default AdsSection;
