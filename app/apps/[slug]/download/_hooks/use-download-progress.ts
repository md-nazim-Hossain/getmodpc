'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProgressPhase = 'preparing' | 'ready' | 'downloading' | 'error';

interface UseDownloadProgressOptions {
  token: string;
  /** URL returned by getDownloads — resolved after token is used */
  onGetDownloadUrl: (token: string) => Promise<string>;
}

interface UseDownloadProgressReturn {
  phase: ProgressPhase;
  progress: number;
  downloadUrl: string | null;
  size: string | null;
  error: string | null;
  triggerDownload: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FAKE_PROGRESS_DURATION_MS = 3000; // total fake fill time
const FAKE_PROGRESS_CAP = 90; // stop fake fill here
const TICK_INTERVAL_MS = 80;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDownloadProgress({
  token,
  onGetDownloadUrl,
}: UseDownloadProgressOptions): UseDownloadProgressReturn {
  const [phase, setPhase] = useState<ProgressPhase>('preparing');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const resolvedRef = useRef(false);

  // ── Fake progress ticker ──────────────────────────────────────────────────
  const startFakeProgress = useCallback(() => {
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const ratio = Math.min(elapsed / FAKE_PROGRESS_DURATION_MS, 1);
      // ease-out curve: fast start, decelerates toward cap
      const eased = 1 - Math.pow(1 - ratio, 3);
      const next = Math.round(eased * FAKE_PROGRESS_CAP);

      setProgress((prev) => {
        if (resolvedRef.current) return prev; // token already back — let completer take over
        return Math.max(prev, next);
      });
    }, TICK_INTERVAL_MS);
  }, []);

  const stopFakeProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Complete progress to 100 % then flip to ready ────────────────────────
  const completeProgress = useCallback(() => {
    resolvedRef.current = true;
    stopFakeProgress();

    // Animate remaining gap → 100 % smoothly
    let current = 0;
    setProgress((p) => {
      current = p;
      return p;
    });

    const completer = setInterval(() => {
      current = Math.min(current + 3, 100);
      setProgress(current);
      if (current >= 100) {
        clearInterval(completer);
        // Small delay so user sees 100 % before button appears
        setTimeout(() => setPhase('ready'), 300);
      }
    }, TICK_INTERVAL_MS);
  }, [stopFakeProgress]);

  // ── Resolve token → download URL ─────────────────────────────────────────
  const resolveToken = useCallback(async () => {
    try {
      const url = await onGetDownloadUrl(token);
      setDownloadUrl(url);
      completeProgress();
    } catch (err) {
      stopFakeProgress();
      setError(
        err instanceof Error ? err.message : 'Failed to prepare download.'
      );
      setPhase('error');
    }
  }, [token, onGetDownloadUrl, completeProgress, stopFakeProgress]);

  // ── Bootstrap on mount ───────────────────────────────────────────────────
  useEffect(() => {
    startFakeProgress();
    resolveToken();

    return () => stopFakeProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once

  // ── Trigger download ─────────────────────────────────────────────────────
  const triggerDownload = useCallback(() => {
    if (!downloadUrl) return;
    setPhase('downloading');

    // Open in new tab — browser handles the file download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [downloadUrl]);

  return { phase, progress, downloadUrl, size, error, triggerDownload };
}
