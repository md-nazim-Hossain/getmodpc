'use client';

import React from 'react';

import Image from 'next/image';

import { TestimonialCardProps } from '@/types';

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const {
    author_name,
    author_image,
    designation,
    workplace_name,
    workplace_logo,
    message,
  } = testimonial;

  return (
    <div className='testimonial-card flex gap-8 pr-8 h-full'>
      {/* Left: Author Image */}
      <div className='shrink-0 w-45 xl:w-50'>
        <div className='relative w-full aspect-3/4 overflow-hidden bg-neutral-100'>
          <Image
            src={author_image}
            alt={`Photo of ${author_name}`}
            fill
            className='object-cover object-top'
            sizes='(max-width: 768px) 140px, 200px'
          />
          {/* Workplace badge overlay */}
          {workplace_logo && (
            <div className='absolute bottom-0 left-0 right-0 bg-white px-3 py-2 border-t border-neutral-100'>
              <Image
                src={workplace_logo}
                alt={`${workplace_name} logo`}
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
            {author_name}
          </p>
          <p className='text-[12px] text-neutral-500 mt-0.5 leading-snug'>
            {designation}
            {workplace_name && !workplace_logo && (
              <span className='block text-neutral-400'>{workplace_name}</span>
            )}
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
          <p className='text-[15px] sm:text-base lg:text-[17px] text-neutral-700 leading-relaxed font-light tracking-wide'>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
