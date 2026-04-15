'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AdCardProps } from '@/types';

import { Card } from '@/components/ui/card';

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const {
    banner_image,
    banner_bg_color,
    title,
    description,
    cta_label,
    cta_link,
  } = ad;

  return (
    <Card
      className='
        group relative overflow-hidden rounded-2xl border-0
        shadow-[0_2px_16px_rgba(0,0,0,0.08)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)]
        transition-shadow duration-300 ease-out
        bg-white w-full select-none
      '
    >
      {/* ── Banner ── */}
      <div
        className='relative w-full h-42 overflow-hidden'
        style={{ backgroundColor: banner_bg_color ?? '#5B4EE8' }}
        aria-hidden='true'
      >
        {/* Soft radial highlight for depth */}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.18)_0%,transparent_60%)] pointer-events-none' />

        <Image
          src={banner_image}
          alt='' // decorative — described by card title
          fill
          className='object-cover object-center'
          sizes='(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 280px'
          draggable={false}
        />
      </div>

      {/* ── Content ── */}
      <div className='px-5 pt-4 pb-5 flex flex-col gap-2.5'>
        {/* Title */}
        <h3 className='text-[15px] font-semibold text-neutral-900 leading-snug tracking-tight'>
          {title}
        </h3>

        {/* Description */}
        <p className='text-[13px] text-neutral-500 leading-[1.6] font-normal'>
          {description}
        </p>

        {/* Divider */}
        <div className='border-t border-neutral-100 mt-1' />

        {/* CTA */}
        <Link
          href={cta_link}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`${cta_label} — ${title}`}
          className='
            inline-flex items-center justify-center
            text-[13.5px] font-semibold
            text-[#5B4EE8] hover:text-[#4338CA]
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4EE8] focus-visible:ring-offset-2 rounded-sm
          '
        >
          {cta_label}
        </Link>
      </div>
    </Card>
  );
};

export default AdCard;
