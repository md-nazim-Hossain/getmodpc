'use client';

import React, { useCallback, useRef, useState } from 'react';

import { TestimonialsSectionProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import TestimonialCard from '@/components/cards/testimonial-card';

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = 'What our customers say',
  subtitle = 'TESTIMONIALS',
  testimonials,
  autoplay = false,
  autoplayDelay = 5000,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const progressWidth = Math.min(
    ((activeIndex + slidesPerView) / testimonials.length) * 100,
    100
  );

  const swiperModules = autoplay ? [Autoplay, A11y] : [A11y];

  return (
    <section
      className='bg-white py-16 sm:py-20 lg:py-28 overflow-hidden'
      aria-label='Customer Testimonials'
    >
      <div className='mx-auto px-6 lg:px-12 max-w-350'>
        {/* ── Header ── */}
        <div className='flex items-end justify-between mb-12 sm:mb-16'>
          <div>
            {subtitle && (
              <p className='text-[10px] tracking-[0.22em] uppercase font-semibold text-neutral-400 mb-3'>
                {subtitle}
              </p>
            )}
            <h2 className='text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-light text-neutral-900 tracking-tight leading-[1.15]'>
              {title}
            </h2>
          </div>

          {/* Nav Buttons */}
          <div className='flex gap-2 pb-1'>
            <button
              onClick={handlePrev}
              aria-label='Previous testimonial'
              className='
                group w-11 h-11 border border-neutral-300
                flex items-center justify-center
                hover:bg-neutral-900 hover:border-neutral-900
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-800
              '
            >
              <ChevronLeft
                size={16}
                className='text-neutral-500 group-hover:text-white transition-colors duration-200'
                aria-hidden
              />
            </button>
            <button
              onClick={handleNext}
              aria-label='Next testimonial'
              className='
                group w-11 h-11 border border-neutral-300
                flex items-center justify-center
                hover:bg-neutral-900 hover:border-neutral-900
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-800
              '
            >
              <ChevronRight
                size={16}
                className='text-neutral-500 group-hover:text-white transition-colors duration-200'
                aria-hidden
              />
            </button>
          </div>
        </div>

        {/* ── Carousel ── */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSlidesPerView(
              typeof swiper.params.slidesPerView === 'number'
                ? Math.floor(swiper.params.slidesPerView)
                : 1
            );
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onBreakpoint={(swiper) => {
            setSlidesPerView(
              typeof swiper.params.slidesPerView === 'number'
                ? Math.floor(swiper.params.slidesPerView)
                : 1
            );
          }}
          modules={swiperModules}
          loop={testimonials.length > 2}
          speed={650}
          grabCursor
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
            0: { slidesPerView: 1, spaceBetween: 0 },
            640: { slidesPerView: 1.25, spaceBetween: 0 },
            1024: { slidesPerView: 2, spaceBetween: 0 },
            1280: { slidesPerView: 2.15, spaceBetween: 0 },
          }}
          a11y={{
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
          }}
          className='overflow-visible!'
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className='h-auto!'>
              <div className='border-l border-neutral-200 pl-4 sm:pl-8 pr-4 sm:pr-12 py-1 h-full'>
                <TestimonialCard testimonial={testimonial} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Progress Track ── */}
        <div className='mt-12 sm:mt-16 h-px bg-neutral-200 relative overflow-hidden'>
          <div
            className='absolute inset-y-0 left-0 bg-neutral-800 transition-all duration-500 ease-out'
            style={{ width: `${progressWidth}%` }}
            role='progressbar'
            aria-valuenow={activeIndex + 1}
            aria-valuemin={1}
            aria-valuemax={testimonials.length}
            aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
