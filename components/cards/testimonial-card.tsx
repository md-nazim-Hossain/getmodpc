'use client';

import React from 'react';

import { TestimonialCardProps } from '@/types';

import { AppImage } from '../ui/app-image';

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { image_url, company_logo, name, designation, content } = testimonial;

  return (
    <div className='testimonial-card flex flex-col md:flex-row md:gap-4 p-6 h-full'>
      {/* Left: Author Image */}
      <div className='shrink-0 w-full md:w-45 xl:w-60 '>
        <div
          style={{ borderRadius: 'var(--glass-border-radius)' }}
          className='relative w-full aspect-square overflow-hidden'
        >
          <AppImage
            src={image_url}
            alt={`Photo of ${name}`}
            fill
            className='object-cover object-top'
            sizes='(max-width: 768px) 140px, 240px'
          />
          {/* Workplace badge overlay */}
          {company_logo && (
            <div className='absolute bottom-0 left-0  bg-white px-3 py-2 border-t border-neutral-100'>
              <AppImage
                src={company_logo}
                alt={`Logo of Company`}
                width={100}
                height={28}
                className='object-contain h-6 w-auto'
              />
            </div>
          )}
        </div>

        {/* Author info below image */}
        <div className='mt-4'>
          <p className='text-[11px] tracking-[0.12em] uppercase font-semibold text-neutral-900 font-mono'>
            {name}
          </p>
          <p className='text-[12px] text-neutral-500 mt-0.5 leading-snug'>
            {designation}
          </p>
        </div>
      </div>

      {/* Right: Testimonial message */}
      <div className='flex-1 flex flex-col justify-between pt-2'>
        {/* Quotation mark decorative */}
        <div>
          <span
            className='block text-5xl md:text-[5rem] leading-none text-neutral-500 font-serif select-none -mb-8'
            aria-hidden='true'
          >
            &ldquo;
          </span>
          <p className='text-sm text-justify sm:text-base text-foreground leading-relaxed font-normal tracking-wide'>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
