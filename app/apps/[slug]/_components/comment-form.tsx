'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { FormInput, FormTextarea, FormWrapper } from '@/components/form';
import { Button } from '@/components/ui/button';

import {
  commentFormSchema,
  CommentFormValues,
  CommentPayload,
} from '@/lib/schemas';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommentFormProps {
  appSlug: string;
  /**
   * Injected action — defaults to a no-op so the component is usable in Storybook
   * and unit tests without a real API. In production, pass your server action or
   * fetch wrapper here.
   */
  submitComment?: (payload: CommentPayload) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommentForm({
  appSlug,
  submitComment = async () => {},
}: CommentFormProps) {
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { name: '', email: '', comment: '' },
  });

  async function onSubmit(values: CommentFormValues) {
    setServerError(null);
    try {
      const payload: CommentPayload = {
        ...values,
        appSlug,
        createdAt: new Date().toISOString(),
      };
      await submitComment(payload);
      setSubmitted(true);
      form.reset();
    } catch {
      // FIX: original had NO error path — silent failure
      setServerError('Something went wrong. Please try again in a moment.');
    }
  }

  return (
    <section className='mt-10' aria-labelledby={`${formId}-heading`}>
      <div className='flex items-center gap-2 mb-6'>
        <h2 id={`${formId}-heading`} className='text-2xl font-bold'>
          Leave a Comment
        </h2>
      </div>

      {submitted ? (
        <div
          role='status'
          aria-live='polite'
          className='flex flex-col items-center justify-center py-12 gap-3 bg-emerald-50 rounded-2xl border border-emerald-100'
        >
          <CheckCircle2 className='w-10 h-10 text-emerald-500' aria-hidden />
          <p className='text-lg font-semibold text-slate-700'>
            Comment Submitted!
          </p>
          <p className='text-sm text-slate-500'>
            Thank you for your feedback. It will appear after review.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => setSubmitted(false)}
          >
            Write Another
          </Button>
        </div>
      ) : (
        <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm'>
          {/* Server error alert */}
          {serverError && (
            <div
              role='alert'
              className='flex items-center gap-2 mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm'
            >
              <AlertCircle className='w-4 h-4 shrink-0' aria-hidden />
              {serverError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormWrapper>
              <FormInput
                control={form.control}
                name='name'
                placeholder='Your full name'
              />
              <FormInput
                control={form.control}
                name='email'
                placeholder='your@email.com'
                fieldProps={{
                  type: 'email',
                }}
              />
              <FormTextarea
                control={form.control}
                name='comment'
                placeholder='Share your experience with this app…'
                maxChars={1000}
              />
            </FormWrapper>

            {/* ── Submit ──────────────────────────────────────────────── */}
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              aria-busy={form.formState.isSubmitting}
              className='w-full mt-4 bg-primary hover:bg-primary/90 text-white
                           font-semibold py-3 rounded-md text-sm sm:text-base
                           transition-colors duration-200 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {form.formState.isSubmitting ? 'Submitting…' : 'Submit Comment'}
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}
