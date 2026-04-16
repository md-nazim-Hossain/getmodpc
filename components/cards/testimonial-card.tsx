'use client';

import React from 'react';

import Image from 'next/image';

import { TestimonialCardProps } from '@/types';

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { image_url, company_logo, name, designation, content } = testimonial;

  return (
    <div className='testimonial-card flex gap-8 pr-8 h-full'>
      {/* Left: Author Image */}
      <div className='shrink-0 w-45 xl:w-60'>
        <div className='relative w-full aspect-square overflow-hidden bg-neutral-100'>
          <Image
            src={image_url}
            alt={`Photo of ${name}`}
            fill
            className='object-cover object-top'
            sizes='(max-width: 768px) 140px, 240px'
          />
          {/* Workplace badge overlay */}
          {company_logo && (
            <div className='absolute bottom-0 left-0  bg-white px-3 py-2 border-t border-neutral-100'>
              <Image
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
            className='block text-[5rem] leading-none text-neutral-200 font-serif select-none -mb-4'
            aria-hidden='true'
          >
            &ldquo;
          </span>
          <p className='text-[15px] sm:text-base lg:text-[17px] text-foreground leading-relaxed font-medium tracking-wide'>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
