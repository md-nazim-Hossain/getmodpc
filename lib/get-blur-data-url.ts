// lib/get-blur-data-url.ts
// Server-only — never import in client components.
// Generates blurDataURL via plaiceholder + caches result in-process (LRU-style Map).
import { getPlaiceholder } from 'plaiceholder';

// ─── In-process cache ─────────────────────────────────────────────────────────
// Simple bounded Map. Next.js module cache persists across requests in same worker.
// For multi-worker / edge, replace with Redis or KV store.

const MAX_CACHE = 500;
const blurCache = new Map<string, string>();

function evictIfNeeded() {
  if (blurCache.size >= MAX_CACHE) {
    // Evict oldest entry (insertion order)
    const firstKey = blurCache.keys().next().value;
    if (firstKey) blurCache.delete(firstKey);
  }
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchImageBuffer(src: string): Promise<Buffer> {
  // Handle relative URLs in SSR context
  const url = src.startsWith('http')
    ? src
    : `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${src}`;

  const res = await fetch(url, {
    // Cache at HTTP level for 1 hour — reduces origin hits
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${url}`);

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Returns a base64 blurDataURL for any image src.
 * Safe to call in Server Components and server actions.
 * Returns `undefined` on failure so caller can omit placeholder gracefully.
 */
export async function getBlurDataUrl(src: string): Promise<string | undefined> {
  if (!src) return undefined;

  // Cache hit
  const cached = blurCache.get(src);
  if (cached) return cached;

  try {
    const buffer = await fetchImageBuffer(src);
    const { base64 } = await getPlaiceholder(buffer, { size: 10 }); // tiny = fast

    evictIfNeeded();
    blurCache.set(src, base64);

    return base64;
  } catch {
    // Non-fatal — caller falls back to no placeholder
    return undefined;
  }
}
