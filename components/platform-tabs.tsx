'use client';

// components/platform-tabs/PlatformTabs.tsx
//
// Floating platform-switcher + expandable search bar.
//
// Behaviour:
//  - Appears when page scrolls past 100 vh (smooth bottom-up entrance)
//  - Disappears on scroll back to top
//  - Clicking a platform tab updates the route  /android | /apple | /windows
//  - Search icon expands an input; debounced API call fetches apps
//  - Results appear in a popover; clicking navigates to /apps/[slug]
//
// Dependencies:
//  framer-motion, next/navigation, lucide-react, tailwindcss, shadcn/ui
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { SearchAppItem } from '@/types/home-apps.types';
import { EnumPlatformType } from '@/types/types.app';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

import { getAppsBySearchKeyword } from '@/server/get/get-apps';

import { PlatformIcon } from '@/components/platform-icon';

import { Skeleton } from './ui/skeleton';

// ─── Types ────────────────────────────────────────────────────────────────────

// interface SearchResult {
//   id: string;
//   slug: string;
//   name: string;
//   icon: string;
//   platform: string;
// }

// ─── Constants ────────────────────────────────────────────────────────────────

// String literals cast to EnumPlatformType so TS is happy whether the type is
// a string-enum or a plain union.
const PLATFORMS = [
  { key: 'android' as EnumPlatformType, label: 'Android' },
  { key: 'windows' as EnumPlatformType, label: 'Windows' },
  { key: 'apple' as EnumPlatformType, label: 'Apple' },
] satisfies { key: EnumPlatformType; label: string }[];

const SCROLL_THRESHOLD =
  typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600;
const DEBOUNCE_DELAY = 350; // ms

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Search API ───────────────────────────────────────────────────────────────

async function fetchSearchResults(keyword: string): Promise<SearchAppItem[]> {
  if (!keyword.trim()) return [];
  try {
    const res = await getAppsBySearchKeyword(keyword);
    return res.data ?? [];
  } catch {
    return [];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PlatformTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active platform from pathname
  const activePlatform: EnumPlatformType =
    PLATFORMS.find((p) => pathname.startsWith(`/${p.key}`))?.key ??
    ('android' as EnumPlatformType);

  // Scroll visibility
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > SCROLL_THRESHOLD);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchAppItem[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // Fetch on debounced query change
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setSearching(false);
      return;
    }

    let cancelled = false;

    fetchSearchResults(debouncedQuery).then((data) => {
      if (!cancelled) {
        setResults(data);
        setSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Clear results when query is emptied
  useEffect(() => {
    if (!query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setSearching(false);
    }
  }, [query]);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen, closeSearch]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') closeSearch();

      if (e.key === 'Enter') {
        router.push(`/search/${encodeURIComponent(query)}`);
      }
    },
    [closeSearch, router, query]
  );

  const handlePlatformClick = useCallback(
    (platform: EnumPlatformType) => {
      router.push(`/${platform}`);
    },
    [router]
  );

  const handleResultClick = useCallback(
    (slug: string) => {
      router.push(`/apps/${slug}`);
      closeSearch();
    },
    [router, closeSearch]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key='platform-tabs'
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          className='fixed bottom-8 left-8 right-8 z-50 '
          aria-label='Platform navigation'
        >
          {/* Search popover — renders above the bar */}
          <AnimatePresence>
            {searchOpen && !!query && (
              <motion.div
                key='search-popover'
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className='
                  absolute bottom-full translate-y-0  right-4 mb-0
                  bg-white 
                  rounded-2xl shadow-xl overflow-hidden
                  max-h-64 overflow-y-auto w-150
                '
                role='listbox'
                aria-label='Search results'
              >
                {/* Loading state */}
                {searching && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className='w-full px-4 py-3 flex gap-2 items-center'
                      >
                        <Skeleton className='size-8 rounded-lg' />
                        <Skeleton className='flex-1 h-8' />
                      </div>
                    ))}
                  </>
                )}

                {/* Results */}
                {!searching && results.length > 0 && (
                  <>
                    {results.map((app) => (
                      <button
                        key={app.id}
                        role='option'
                        onClick={() => handleResultClick(app.slug)}
                        className='flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/10 transition-colors text-left'
                      >
                        <div className='relative size-8 rounded-lg overflow-hidden shrink-0 bg-muted'>
                          <Image
                            src={app.icon}
                            alt={app.name}
                            fill
                            className='object-cover'
                            sizes='32px'
                          />
                        </div>
                        <span className='text-sm font-medium truncate'>
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Empty state */}
                {!searching && results.length === 0 && query.trim() && (
                  <div className='flex items-center justify-center p-4'>
                    <p>No results found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Tab bar ── */}
          <div
            ref={containerRef}
            className='
              bg-white/40 backdrop-blur-lg shadow-2xl
              flex items-center
               safe-area-pb rounded-full 
            '
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Platform tabs */}
            <div className='flex flex-1 items-center  py-1'>
              {PLATFORMS.map((p) => {
                const isActive = activePlatform === p.key;
                return (
                  <motion.button
                    key={p.key}
                    onClick={() => handlePlatformClick(p.key)}
                    className={`
                      relative flex flex-1 flex-col items-center justify-center gap-0.5 cursor-pointer
                      py-4 text-xs font-medium transition-colors rounded-full hover:bg-muted
                      ${isActive ? 'text-primary' : 'text-foreground hover:text-primary '}
                    `}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={p.label}
                    whileTap={{ scale: 0.92 }}
                  >
                    <PlatformIcon platform={p.key} size='lg' />
                    <span className='text-[11px] leading-none mt-0.5'>
                      {p.label}
                    </span>

                    {/* Active indicator pill */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId='active-platform-pill'
                          className='absolute top-1 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary'
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Search trigger / expandable input */}
            <div className='flex items-stretch justify-end shrink-0 pr-1  h-full '>
              <AnimatePresence mode='wait'>
                {searchOpen ? (
                  <motion.div
                    key='search-input'
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 600, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className='flex items-center bg-white rounded-full pl-4 pr-6 h-18 overflow-hidden shadow-md'
                  >
                    <Search className='size-6 text-foreground shrink-0' />
                    <input
                      ref={inputRef}
                      type='text'
                      value={query}
                      onChange={(e) => {
                        const value = e.target.value;
                        setQuery(value);
                        if (value.trim()) {
                          setSearching(true);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder='Search apps…'
                      className='
                        flex-1 bg-transparent text-lg text-foreground
                        placeholder:text-muted-foreground
                        outline-none border-none ml-2
                      '
                      aria-label='Search apps'
                      aria-autocomplete='list'
                      aria-controls='search-results'
                    />

                    <button
                      onClick={() => {
                        if (query) {
                          setQuery('');
                        } else {
                          closeSearch();
                        }
                      }}
                      className='text-muted-foreground hover:text-foreground ml-1'
                      aria-label='Close search'
                    >
                      <X className='size-4' />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key='search-icon'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={openSearch}
                    className='
                      flex items-center justify-center
                      size-9 rounded-full
                      text-foreground hover:text-primary hover:bg-muted
                      transition-colors mr-6
                    '
                    aria-label='Open search'
                    whileTap={{ scale: 0.88 }}
                  >
                    <Search className='size-6' />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
