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

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { getActiveReportReasons } from '@/server/get/get-reports';

import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormWrapper,
} from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ReportAppFormValues, reportAppSchema } from '@/lib/schemas';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportAppDialogProps {
  /** Shown in the dialog title for context */
  appName?: string;
  /** Controlled open state — omit to use internal state via a trigger */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after successful validation with the collected data */
  onSubmit?: (values: ReportAppFormValues) => Promise<void> | void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportAppDialog({
  appName,
  open,
  onOpenChange,
  onSubmit,
}: ReportAppDialogProps) {
  const form = useForm<ReportAppFormValues>({
    resolver: zodResolver(reportAppSchema),
    defaultValues: {
      email: '',
      reason: 'Not Working',
      details: '',
    },
  });

  const handleSubmit = useCallback(
    async (values: ReportAppFormValues) => {
      await onSubmit?.(values);
      form.reset();
      onOpenChange(false);
    },
    [form, onOpenChange, onSubmit]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) form.reset();
      onOpenChange(nextOpen);
    },
    [form, onOpenChange]
  );

  const { data } = useQuery({
    queryKey: ['active-report-reasons'],
    queryFn: async () => await getActiveReportReasons(),
  });

  const reasons =
    data?.data?.map((reason) => ({
      value: reason.id,
      label: reason.title,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='w-full max-w-md rounded-2xl p-0 gap-0 overflow-hidden'
        aria-describedby={undefined}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className='flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-border'>
          <DialogTitle className='text-base font-semibold text-foreground'>
            {appName ? `Report "${appName}"` : 'Report App'}
          </DialogTitle>
          <DialogClose asChild>
            <button
              type='button'
              className='rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              aria-label='Close dialog'
            >
              <X className='w-4 h-4' />
            </button>
          </DialogClose>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='px-6 py-5 space-y-5'
          noValidate
        >
          <FormWrapper>
            <FormInput
              control={form.control}
              name='email'
              placeholder='your@email.com'
              fieldProps={{
                type: 'email',
              }}
            />
            <FormSelect
              control={form.control}
              name='reason'
              placeholder='Select a reason'
              options={reasons}
            />
            <FormTextarea control={form.control} name='details' />
          </FormWrapper>

          {/* Submit */}
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full h-11 bg-foreground hover:opacity-90 text-background font-semibold rounded-full transition-opacity disabled:opacity-60'
          >
            {form.formState.isSubmitting ? 'Submitting…' : 'Submit Now'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
