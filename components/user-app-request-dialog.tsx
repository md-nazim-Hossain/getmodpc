'use client';

// components/app/UserAppRequestDialog.tsx
//
// Dialog for users to request a new app to be added.
// Follows the same pattern as ReportAppDialog.
//
// Usage:
//   <UserAppRequestDialog open={open} onOpenChange={setOpen} />
//   <UserAppRequestDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} />
import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormInput, FormWrapper } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { UserAppRequestFormValues, userAppRequestSchema } from '@/lib/schemas';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserAppRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after successful validation with the collected data */
  onSubmit?: (values: UserAppRequestFormValues) => Promise<void> | void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserAppRequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: UserAppRequestDialogProps) {
  const form = useForm<UserAppRequestFormValues>({
    resolver: zodResolver(userAppRequestSchema),
    defaultValues: {
      app_name: '',
      app_url: '',
    },
  });

  const handleSubmit = useCallback(
    async (values: UserAppRequestFormValues) => {
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='w-full max-w-md rounded-2xl p-0 gap-0 overflow-hidden'
        aria-describedby={undefined}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className='flex flex-row items-center justify-between px-6 pt-4 pb-4 border-b border-gray-200'>
          <DialogTitle className='text-base font-semibold text-foreground'>
            Request an App
          </DialogTitle>
        </DialogHeader>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='px-6 py-5 space-y-5'
          noValidate
        >
          <FormWrapper>
            <FormInput
              control={form.control}
              name='app_name'
              placeholder='e.g. Spotify'
              fieldProps={{ type: 'text' }}
            />
            <FormInput
              control={form.control}
              name='app_url'
              placeholder='e.g. https://play.google.com/…'
              fieldProps={{ type: 'url' }}
            />
          </FormWrapper>

          {/* Submit */}
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full h-11 bg-foreground hover:opacity-90 text-background font-semibold rounded-full transition-opacity disabled:opacity-60'
          >
            {form.formState.isSubmitting ? 'Submitting…' : 'Submit Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
