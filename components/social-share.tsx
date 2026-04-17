'use client';

import React, { useState } from 'react';

import { Check, Copy, Share2 } from 'lucide-react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  /** Required for Pinterest */
  image?: string;
  className?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ICON_SIZE = 36;
const ICON_RADIUS = 10;

// ─── Component ────────────────────────────────────────────────────────────────

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  image = '',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Heading */}
      {/* <div className='flex items-center gap-2 mb-4'>
        <Share2 className='size-4 text-muted-foreground' />
        <span className='text-sm font-semibold text-foreground'>Share</span>
      </div> */}

      {/* Share Buttons */}
      <div className='flex items-center flex-wrap gap-3'>
        <ShareItem label='Facebook'>
          <FacebookShareButton url={url} hashtag={title}>
            <FacebookIcon size={ICON_SIZE} borderRadius={ICON_RADIUS} />
          </FacebookShareButton>
        </ShareItem>

        <ShareItem label='Twitter / X'>
          <TwitterShareButton url={url} title={title}>
            <XIcon size={ICON_SIZE} borderRadius={ICON_RADIUS} />
          </TwitterShareButton>
        </ShareItem>

        <ShareItem label='Pinterest'>
          <PinterestShareButton
            url={url}
            media={image}
            description={description}
          >
            <PinterestIcon size={ICON_SIZE} borderRadius={ICON_RADIUS} />
          </PinterestShareButton>
        </ShareItem>

        <ShareItem label='LinkedIn'>
          <LinkedinShareButton url={url} title={title} summary={description}>
            <LinkedinIcon size={ICON_SIZE} borderRadius={ICON_RADIUS} />
          </LinkedinShareButton>
        </ShareItem>

        <ShareItem label='Email'>
          <EmailShareButton url={url} subject={title} body={description}>
            <EmailIcon size={ICON_SIZE} borderRadius={ICON_RADIUS} />
          </EmailShareButton>
        </ShareItem>

        {/* Copy link */}
        <ShareItem label={copied ? 'Copied!' : 'Copy Link'}>
          <button
            onClick={copyLink}
            aria-label='Copy link'
            className={cn(
              'flex items-center justify-center rounded-[10px] transition-all duration-200',
              'bg-muted hover:bg-muted/80',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            )}
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
          >
            {copied ? (
              <Check className='size-4 text-green-500' />
            ) : (
              <Copy className='size-4 text-foreground/70' />
            )}
          </button>
        </ShareItem>
      </div>
    </div>
  );
};

// ─── ShareItem wrapper ────────────────────────────────────────────────────────

const ShareItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col items-center gap-1.5 group'>
    <div className='transition-transform duration-150 group-hover:scale-110 group-active:scale-95'>
      {children}
    </div>
    <span className='text-[10px] text-muted-foreground font-medium leading-none'>
      {label}
    </span>
  </div>
);

export default SocialShare;
