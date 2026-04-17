'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Ad } from '@/types/ads';

import { Card } from '@/components/ui/card';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdCardProps {
  ad: Ad;
}

// ─── Component ────────────────────────────────────────────────────────────────

const MediaViewer = ({
  media_url,
  isVideo,
}: {
  media_url: string;
  isVideo: boolean;
}) =>
  isVideo ? (
    <video
      src={media_url}
      autoPlay
      muted
      loop
      playsInline
      className='absolute inset-0 w-full h-full object-cover object-center'
    />
  ) : (
    <Image
      src={media_url}
      alt=''
      fill
      className='object-cover object-center'
      sizes='(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 280px'
      draggable={false}
    />
  );

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { media_url, media_type, title, description, cta_label, cta_url } = ad;

  const isVideo = media_type === 'video';

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
        className='relative w-full h-42 overflow-hidden bg-[#5B4EE8]'
        aria-hidden='true'
      >
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.18)_0%,transparent_60%)] pointer-events-none z-10' />

        {!title && cta_url ? (
          <Link href={cta_url} target='_blank'>
            <MediaViewer media_url={media_url} isVideo={isVideo} />
          </Link>
        ) : (
          <MediaViewer media_url={media_url} isVideo={isVideo} />
        )}
      </div>

      {/* ── Content ── */}
      {title && (
        <div className='px-5 pt-4 pb-5 flex flex-col gap-2.5'>
          <h3 className='text-[15px] font-semibold text-neutral-900 leading-snug tracking-tight'>
            {title}
          </h3>

          <p className='text-[13px] text-neutral-500 leading-[1.6] font-normal'>
            {description}
          </p>

          <div className='border-t border-neutral-100 mt-1' />

          <Link
            href={cta_url}
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
      )}
    </Card>
  );
};

export default AdCard;
