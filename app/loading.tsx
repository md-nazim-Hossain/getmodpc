import { cn } from '@/lib/utils';

const BARS = [
  { height: 'h-5', delay: 'delay-100' },
  { height: 'h-8', delay: 'delay-[250ms]' },
  { height: 'h-7', delay: 'delay-0' },
  { height: 'h-9', delay: 'delay-[400ms]' },
  { height: 'h-6', delay: 'delay-150' },
  { height: 'h-[30px]', delay: 'delay-300' },
  { height: 'h-[18px]', delay: 'delay-[50ms]' },
] as const;

export default function Loading() {
  return (
    <div className='fixed inset-0 z-999 flex flex-col items-center justify-center gap-5 bg-background'>
      {/* ── Waveform bars ─────────────────────────────────────────── */}
      <div className='flex items-end gap-1.25'>
        {BARS.map(({ height, delay }, i) => (
          <span
            key={i}
            className={cn(
              'w-1 rounded-full bg-primary origin-bottom',
              'animate-[wave_1.1s_ease-in-out_infinite]',
              height,
              delay
            )}
          />
        ))}
      </div>

      {/* ── Label + shimmer track ─────────────────────────────────── */}
      <div className='flex flex-col items-center gap-2'>
        <p className='text-[11px] font-semibold tracking-[0.2em] uppercase text-primary/70 animate-pulse'>
          Loading
        </p>

        <div className='relative h-px w-16 overflow-hidden rounded-full bg-primary/20'>
          <span className='absolute inset-y-0 w-8 rounded-full bg-primary/70 animate-[shimmer_1.6s_ease-in-out_infinite]' />
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.35); opacity: 0.3; }
          50%       { transform: scaleY(1);    opacity: 1;   }
        }
        @keyframes shimmer {
          0%   { left: -50%; }
          100% { left: 150%; }
        }
      `}</style>
    </div>
  );
}
