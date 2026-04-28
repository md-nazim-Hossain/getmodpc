// components/ui/app-image.tsx
//
// Drop-in replacement for `next/image`.
// Adds:
//   - Dynamic blurDataURL (server-generated via plaiceholder)
//   - Graceful fallback on broken/missing src
//   - Forwarded props — all native ImageProps usable as-is
//
// Optimization strategy:
//   Default → unoptimized=true  (server images served as-is, no Next.js pipeline)
//   optimize=true               → unoptimized=false + quality=100 (client uploads,
//                                 avatars, or any image you want Next.js to compress)
//
// Usage:
//   Server Component  → pass `blurDataUrl` prop (generated upstream)
//   Client Component  → omit `blurDataUrl`; no blur placeholder shown
import Image, { ImageProps } from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppImageProps extends Omit<
  ImageProps,
  'placeholder' | 'blurDataURL'
> {
  /**
   * Pre-generated base64 blur string from `getBlurDataUrl()`.
   * Pass from Server Components for CLS-free loading.
   * Omit in pure client contexts — falls back to no placeholder.
   */
  blurDataUrl?: string;
  /**
   * Shown when src is invalid/missing. Defaults to '/placeholder.png'.
   */
  fallbackSrc?: string;
  /**
   * Enable Next.js image optimization pipeline.
   * Default: false — server/CMS images are served unmodified.
   * Set true for client-side images (avatars, uploads) to get
   * format conversion + maximum quality compression.
   */
  optimize?: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
const DEFAULT_FALLBACK = '/placeholder-3.svg';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AppImage — universal image wrapper.
 *
 * CMS / server image (unoptimized, with blur):
 * ```tsx
 * const blur = await getBlurDataUrl(app.header_image);
 * <AppImage src={app.header_image} blurDataUrl={blur} fill alt={app.name} priority />
 * ```
 *
 * Client image — avatar, upload (optimized at max quality):
 * ```tsx
 * <AppImage src={user.avatar} optimize width={56} height={56} alt={user.name} />
 * ```
 */
export function AppImage({
  src,
  blurDataUrl,
  fallbackSrc = DEFAULT_FALLBACK,
  sizes = DEFAULT_SIZES,
  priority = false,
  optimize = false,
  alt,
  ...rest
}: AppImageProps) {
  // Resolve src — guard null/undefined from CMS
  const resolvedSrc = src && String(src) ? src : fallbackSrc;

  // Blur config — only when blurDataUrl provided (server path)
  const blurProps: Pick<ImageProps, 'placeholder' | 'blurDataURL'> = blurDataUrl
    ? { placeholder: 'blur', blurDataURL: blurDataUrl }
    : { placeholder: 'empty' };

  // Optimization config:
  //   optimize=false (default) → unoptimized=true, no quality param (irrelevant)
  //   optimize=true            → unoptimized=false, quality=100 (max fidelity
  //                              after Next.js format conversion, e.g. → WebP/AVIF)
  const optimizationProps: Pick<ImageProps, 'unoptimized' | 'quality'> =
    optimize ? { unoptimized: false, quality: 100 } : { unoptimized: true };

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      {...blurProps}
      {...optimizationProps}
      {...rest}
      // onError: swap to fallback on broken CDN link.
      // Guard against loop if fallback itself 404s.
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallbackSrc) {
          img.src = fallbackSrc;
        }
      }}
    />
  );
}
