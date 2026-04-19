'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Card } from '@/components/ui/card';

import { formatFileSize } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppProgressContentProps {
  token: string;
  fileName?: string;
  fileSize?: string;
  appName?: string;
  appIcon?: string;
}

type Phase = 'preparing' | 'ready' | 'downloading' | 'error';

// ─── Constants ────────────────────────────────────────────────────────────────

const FAKE_DURATION_MS = 3000;
const FAKE_CAP = 90;
const TICK_MS = 80;

// ─── Component ────────────────────────────────────────────────────────────────

const AppProgressContent: React.FC<AppProgressContentProps> = ({
  token,
  fileName,
  fileSize,
  appName,
  appIcon,
}) => {
  const [phase, setPhase] = useState<Phase>('preparing');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const ratio = Math.min(
        (Date.now() - startRef.current) / FAKE_DURATION_MS,
        1
      );
      const eased = 1 - Math.pow(1 - ratio, 3);
      const next = Math.round(eased * FAKE_CAP);

      setProgress((prev) => {
        if (prev >= FAKE_CAP) {
          clearInterval(intervalRef.current!);
          let cur = FAKE_CAP;
          const completer = setInterval(() => {
            cur = Math.min(cur + 3, 100);
            setProgress(cur);
            if (cur >= 100) {
              clearInterval(completer);
              setTimeout(() => setPhase('ready'), 300);
            }
          }, TICK_MS);
          return prev;
        }
        return Math.max(prev, next);
      });
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setPhase('ready');
  }, []);

  const appDownloadLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/downloads?token=${token}`;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .download-fade-in { animation: fade-in-up 0.35s ease both; }
      `}</style>

      <Card className='p-5 flex flex-col gap-6'>
        {/* ── App identity ──────────────────────────────────────── */}
        {(appIcon || appName) && (
          <div className='flex flex-col items-center gap-2 pt-2'>
            {appIcon && (
              <div className='relative size-16 shrink-0 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/10'>
                <Image
                  src={appIcon}
                  alt={appName ?? 'App icon'}
                  fill
                  className='object-cover'
                  sizes='64px'
                />
              </div>
            )}
            {appName && (
              <p className='text-base font-semibold text-foreground text-center leading-tight'>
                {appName}
              </p>
            )}
          </div>
        )}

        {/* ── Progress ──────────────────────────────────────────── */}
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground text-center'>
            {phase === 'preparing' ? (
              <>
                Your link is almost ready, please wait a{' '}
                <span className='font-medium text-foreground'>
                  {progress < 40 ? '5' : progress < 75 ? '3' : '2'} Seconds
                </span>
              </>
            ) : (
              <>
                Your file is ready.{' '}
                <span className='font-medium text-foreground'>
                  Click to download.
                </span>
              </>
            )}
          </p>

          <div className='relative h-3 w-full rounded-full bg-muted overflow-hidden'>
            <div
              className='absolute inset-y-0 left-0 rounded-full bg-foreground transition-[width] duration-100 ease-linear'
              style={{ width: `${progress}%` }}
            />
            <div
              className='absolute inset-0 rounded-full pointer-events-none'
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.6s infinite linear',
              }}
            />
          </div>

          <p className='text-xs text-muted-foreground text-right tabular-nums'>
            {progress}%
          </p>
        </div>

        {/* ── Error banner ──────────────────────────────────────── */}
        {phase === 'error' && errorMessage && (
          <div className='download-fade-in flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3'>
            <AlertCircle className='size-4 text-destructive shrink-0 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-destructive leading-snug'>
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* ── Main download button ── */}

        {/* ── Download / Retry button ───────────────────────────── */}
        {(phase === 'ready' ||
          phase === 'downloading' ||
          phase === 'error') && (
          <div className='download-fade-in flex flex-col items-center gap-3'>
            {phase === 'error' ? (
              <button
                onClick={handleRetry}
                className='
                  inline-flex items-center justify-center gap-2
                  w-full max-w-xs h-11 px-6 rounded-full
                  border border-destructive/40 text-destructive text-sm font-semibold
                  hover:bg-destructive/5 active:scale-[0.97]
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2
                '
              >
                <RefreshCw className='size-4 shrink-0' />
                Try Again
              </button>
            ) : (
              <>
                <Link
                  download
                  href={appDownloadLink}
                  className='
    inline-flex items-center justify-center gap-2
    w-full max-w-xs h-11 px-6 rounded-full
    bg-foreground text-background text-sm font-semibold
    shadow-md hover:opacity-90 active:scale-[0.97]
    transition-all duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  '
                >
                  {phase === 'downloading'
                    ? 'Starting download…'
                    : fileSize
                      ? `Download (${formatFileSize(+fileSize)})`
                      : 'Download Now'}
                </Link>

                {/* ── Fallback "Click here" ── */}
                <p className='text-xs text-muted-foreground text-center'>
                  If the download doesn&apos;t start in a few seconds,{' '}
                  <Link
                    download
                    href={appDownloadLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline underline-offset-2 hover:text-foreground transition-colors'
                  >
                    Click here
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
      </Card>
    </>
  );
};

export default AppProgressContent;
