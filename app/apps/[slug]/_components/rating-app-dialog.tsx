'use client';

// components/app/ReportAppDialog.tsx
//
// Self-contained dialog that collects a bug/issue report about an app.
// Relies on:
//  - shadcn/ui  : Dialog, Button, Label
//  - react-hook-form + zod
//  - Tailwind CSS
//
// Usage:
//   <ReportAppDialog appName="Pawxy VPN" />
//   or with controlled state:
//   <ReportAppDialog appName="Pawxy VPN" open={open} onOpenChange={setOpen} />
import { useCallback } from 'react';

import { X } from 'lucide-react';

import RichTextViewer from '@/components/rich-text-viewer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportAppDialogProps {
  message: string | null;
  /** Controlled open state — omit to use internal state via a trigger */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RatingAppDialog({
  onOpenChange,
  open,
  message,
}: ReportAppDialogProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='w-full max-w-md rounded-2xl p-0 gap-0 overflow-hidden'
        aria-describedby={undefined}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className='flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-border'>
          <DialogTitle className='text-base font-semibold text-foreground'>
            {message && <RichTextViewer content={message} />}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
