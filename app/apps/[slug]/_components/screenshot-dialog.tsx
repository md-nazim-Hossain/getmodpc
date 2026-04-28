'use client';

import { useEffect } from 'react';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import { UseScreenshotViewerReturn } from '@/hooks/use-screenshot-viewer';

import { AppImage } from '@/components/ui/app-image';

interface ScreenshotDialogProps {
  screenshots: string[];
  appName: string;
  viewer: UseScreenshotViewerReturn;
}

export function ScreenshotDialog({
  screenshots,
  appName,
  viewer,
}: ScreenshotDialogProps) {
  const { isOpen, activeIndex, total, close, goNext, goPrev } = viewer;

  // ── Keyboard navigation ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'Escape':
          close();
          break;
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, goNext, goPrev, close]);

  // ── Scroll-lock ─────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || screenshots.length === 0) return null;

  const src = screenshots[activeIndex];

  return (
    /* Backdrop — click outside image to close */
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Screenshot viewer'
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={close}
    >
      {/* Dark overlay */}
      <div
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        aria-hidden
      />

      {/* Counter — top left */}
      <span className='absolute top-4 left-5 text-sm font-semibold text-white z-10 select-none'>
        {activeIndex + 1} / {total}
      </span>

      {/* Close button — top right */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        aria-label='Close screenshot viewer'
        className='absolute top-3 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors'
      >
        <X className='w-5 h-5' aria-hidden />
      </button>

      {/* Prev arrow */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label='Previous screenshot'
        className='absolute left-3 sm:left-6 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors'
      >
        <ChevronLeft className='w-6 h-6' aria-hidden />
      </button>

      {/* Image card — stop propagation so clicking it doesn't close */}
      <div
        className='relative z-10 bg-white rounded-xl overflow-hidden shadow-2xl max-w-100 w-full mx-16'
        onClick={(e) => e.stopPropagation()}
        style={{ aspectRatio: '9/16' }}
      >
        <AppImage
          key={src} // forces re-mount on image change → avoids flicker
          src={src}
          alt={`${appName} screenshot ${activeIndex + 1} of ${total}`}
          fill
          className='object-contain'
          sizes='340px'
          priority
        />
      </div>

      {/* Next arrow */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label='Next screenshot'
        className='absolute right-3 sm:right-6 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors'
      >
        <ChevronRight className='w-6 h-6' aria-hidden />
      </button>
    </div>
  );
}
