'use client';

import React, { useCallback, useRef, useState } from 'react';

import { TestimonialsSectionProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import TestimonialCard from '@/components/cards/testimonial-card';
import { GlassButton } from '@/components/glass-button';
import { Container } from '@/components/layout/container';

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
      className='py-8 sm:py-12 lg:py-16 overflow-hidden'
      aria-label='Customer Testimonials'
    >
      <Container>
        {/* ── Header ── */}
        <div className='flex items-end justify-between mb-8 sm:mb-12'>
          <div>
            {subtitle && (
              <p className='text-[10px] tracking-[0.22em] uppercase font-semibold text-neutral-600 mb-3'>
                {subtitle}
              </p>
            )}
            <h2 className='text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-light text-neutral-900 tracking-tight leading-[1.15]'>
              {title}
            </h2>
          </div>

          {/* Nav Buttons */}
          <div className='flex gap-2 pb-1'>
            <GlassButton
              asButton
              onClick={handlePrev}
              label=''
              icon={
                <ChevronLeft
                  size={16}
                  className='text-neutral-700 group-hover:text-white transition-colors duration-200'
                  aria-hidden
                />
              }
              ariaLabel='Previous testimonial'
              variant={'icon'}
            />
            <GlassButton
              asButton
              onClick={handleNext}
              label=''
              icon={
                <ChevronRight
                  size={16}
                  className='text-neutral-700 group-hover:text-white transition-colors duration-200'
                  aria-hidden
                />
              }
              ariaLabel='Next testimonial'
              variant={'icon'}
            />
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
            0: { slidesPerView: 1, spaceBetween: 10 },
            1024: { slidesPerView: 2, spaceBetween: 30 },
            1920: { slidesPerView: 3, spaceBetween: 30 },
          }}
          a11y={{
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
          }}
          className='overflow-visible!'
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className='h-auto! '>
              <div className={'glass-card-effect-wrapper '}>
                <button className='glass-card'>
                  <TestimonialCard testimonial={testimonial} />
                </button>
                <div className='glass-card-shadow'></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Progress Track ── */}
        {/* <div className='mt-12 sm:mt-16 h-px bg-neutral-200 relative overflow-hidden'>
          <div
            className='absolute inset-y-0 left-0 bg-neutral-800 transition-all duration-500 ease-out'
            style={{ width: `${progressWidth}%` }}
            role='progressbar'
            aria-valuenow={activeIndex + 1}
            aria-valuemin={1}
            aria-valuemax={testimonials.length}
            aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}
          />
        </div> */}
      </Container>
    </section>
  );
};

export default TestimonialsSection;
