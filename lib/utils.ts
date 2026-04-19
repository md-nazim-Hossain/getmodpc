// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDownloads(count: number, version?: string): string {
  if (count >= 1000000000) {
    const formatted = `${(count / 1000000000).toFixed(1)}B`;
    return version ? `${version} + ${formatted}` : formatted;
  }
  if (count >= 1000000) {
    const formatted = `${(count / 1000000).toFixed(1)}M`;
    return version ? `${version} + ${formatted}` : formatted;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatDate(dateString: string, withFullDate?: boolean): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffDays = differenceInDays(now, date);

  if (diffDays === 1) return 'Yesterday';

  if (diffDays < 30) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const shortDate = format(date, 'MMM d');

  if (withFullDate) {
    return `${format(date, 'MMMM d, yyyy')} (${shortDate})`;
  }

  return shortDate;
}

export function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'android':
      return 'android';
    case 'windows':
      return 'monitor';
    case 'apple':
      return 'apple';
    default:
      return 'smartphone';
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * FIX: formatNumber and formatRatings were duplicated across
 * AppDetailsCard.tsx and AppCard.tsx with identical logic.
 * Single source of truth here.
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/**
 * Truncate text at word boundary near `limit`.
 * Replaces the raw `.slice(0, 300)` in AppDetailsCard — that cut mid-word.
 */
export function truncateAtWord(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit);
  const lastSpace = sliced.lastIndexOf(' ');
  return lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
}

/**
 * Returns a star-fill classification for a given 1-based star index and score.
 * Extracted from StarRating render logic for testability.
 */
export type StarFill = 'full' | 'half' | 'empty';

export function getStarFill(index: number, score: number): StarFill {
  if (index <= Math.floor(score)) return 'full';
  if (index - 0.5 <= score) return 'half';
  return 'empty';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
