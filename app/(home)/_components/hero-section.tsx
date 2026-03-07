'use client';

import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { HeroSlide } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { HeroAppCard } from '@/components/cards/herp-app-card';
import Autoplay from 'embla-carousel-autoplay';

interface HeroSectionProps {
  slides: HeroSlide[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <section className='section-spacing bg-linear-to-b from-primary/5 to-transparent relative overflow-hidden '>
      {/* Background Decorative Elements */}

      <Container size='full'>
        <SectionHeader
          title={SECTION_HEADERS.trending.title}
          subtitle={SECTION_HEADERS.trending.subtitle}
          align='left'
        />
      </Container>

      <div className=' px-4 sm:px-6 lg:px-8 relative'>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[plugin.current]}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {slides.map((slide, index) => (
              <CarouselItem
                key={slide.id}
                className='pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4'
              >
                <div className='p-1 h-full'>
                  <HeroAppCard app={slide} badge={slide.badge} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden md:flex' />
          <CarouselNext className='hidden md:flex' />
        </Carousel>
      </div>
    </section>
  );
}
