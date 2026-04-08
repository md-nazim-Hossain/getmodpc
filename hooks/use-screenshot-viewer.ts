import { useCallback, useState } from 'react';

export interface ScreenshotViewerState {
  isOpen: boolean;
  activeIndex: number;
  total: number;
}

export interface ScreenshotViewerActions {
  open: (index: number) => void;
  close: () => void;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
}

export type UseScreenshotViewerReturn = ScreenshotViewerState &
  ScreenshotViewerActions;

/**
 * Encapsulates all screenshot dialog state and navigation.
 * Extracted so AppDetailsCard stays focused on rendering.
 *
 * @param total - Total number of screenshots
 */
export function useScreenshotViewer(total: number): UseScreenshotViewerReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) setActiveIndex(index);
    },
    [total]
  );

  return { isOpen, activeIndex, total, open, close, goNext, goPrev, goTo };
}
