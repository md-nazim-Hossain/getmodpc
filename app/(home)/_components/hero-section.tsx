'use client';

import * as React from 'react';

import Autoplay from 'embla-carousel-autoplay';

import { HeroAppCard } from '@/components/cards/hero-app-card';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { SECTION_HEADERS } from '@/lib/constants';
import { HeroSlide } from '@/lib/data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  slides: HeroSlide[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSection({
  slides,
}: HeroSectionProps): React.JSX.Element | null {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // Guard: Embla's behavior with zero items is undefined and may throw.
  if (slides.length === 0) return null;

  return (
    <section
      className='section-spacing pt-6 bg-linear-to-b from-primary/5 to-transparent relative overflow-hidden'
      aria-labelledby='section-heading-trending'
    >
      <Container size='full'>
        <SectionHeader
          id='section-heading-trending'
          title={SECTION_HEADERS.trending.title}
          titleClassName='uppercase md:text-[2rem]'
          align='left'
        />
      </Container>

      <div className='px-4 sm:px-6 lg:px-8 relative'>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[plugin.current]}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {/* ✅ `index` removed — it was declared but never used */}
            {slides.map((slide) => (
              <CarouselItem
                key={slide.id}
                className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3'
              >
                <div className='p-1 h-full'>
                  <HeroAppCard app={slide} badge={slide.badge} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
