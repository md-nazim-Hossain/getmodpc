'use client';

import React, { useRef } from 'react';

import { AdsSectionProps } from '@/types';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { A11y, Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import AdCard from '@/components/cards/ad-card';

const AdsSection: React.FC<AdsSectionProps> = ({
  heading,
  ads,
  autoplay = false,
  autoplayDelay = 4000,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const modules = autoplay ? [Autoplay, FreeMode, A11y] : [FreeMode, A11y];

  if (!ads.length) return null;

  return (
    <section aria-label={heading ?? 'Promoted content'} className='w-full py-6'>
      {heading && (
        <div className='px-4 sm:px-6 mb-4'>
          <h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-400'>
            {heading}
          </h2>
        </div>
      )}

      {/*
       * Negative horizontal margin + matching padding lets the swiper
       * bleed to the viewport edge while keeping inner content aligned
       * with the page container.
       */}
      <div className=' px-4 sm:px-6 lg:px-8 sb-red'>
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
            // Mobile — natural width cards
            0: {
              spaceBetween: 12,
              slidesOffsetAfter: 24,
            },
            // Tablet
            640: {
              spaceBetween: 16,
              slidesOffsetAfter: 32,
            },
            // Desktop
            1024: {
              spaceBetween: 20,
              slidesOffsetAfter: 40,
            },
          }}
          a11y={{
            prevSlideMessage: 'Previous ad',
            nextSlideMessage: 'Next ad',
          }}
          // Allow slides to overflow so the peek effect is visible
          className='overflow-visible!'
        >
          {ads.map((ad) => (
            <SwiperSlide
              key={ad.id}
              // Fixed width per slide — matches the card's natural design width
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
