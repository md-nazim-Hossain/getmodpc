'use client';

import React, { useRef } from 'react';

import { Ad } from '@/types/ads';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { A11y, Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import AdCard from '@/components/cards/ad-card';

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
  autoplay = false,
  autoplayDelay = 4000,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const modules = autoplay ? [Autoplay, FreeMode, A11y] : [FreeMode, A11y];

  if (!ads.length) return null;

  // Filter only active ads
  const activeAds = ads.filter((ad) => ad.is_active);
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
        <Swiper
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          modules={modules}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
          grabCursor
          slidesOffsetBefore={0}
          slidesOffsetAfter={16}
          spaceBetween={14}
          slidesPerView='auto'
          loop={false}
          speed={480}
          autoplay={
            autoplay
              ? {
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          breakpoints={{
            0: { spaceBetween: 12, slidesOffsetAfter: 24 },
            640: { spaceBetween: 16, slidesOffsetAfter: 32 },
            1024: { spaceBetween: 20, slidesOffsetAfter: 40 },
          }}
          a11y={{
            prevSlideMessage: 'Previous ad',
            nextSlideMessage: 'Next ad',
          }}
          className='overflow-visible!'
        >
          {activeAds.map((ad) => (
            <SwiperSlide
              key={ad.id}
              style={{ width: 'clamp(220px, 60vw, 280px)' }}
              className='h-auto!'
            >
              <AdCard ad={ad} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdsSection;
