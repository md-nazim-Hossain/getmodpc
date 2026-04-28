'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createComment } from '@/server/post/create-comment';

import { FormInput, FormTextarea, FormWrapper } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  commentFormSchema,
  CommentFormValues,
  CommentPayload,
} from '@/lib/schemas';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommentFormProps {
  app_id: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommentForm({ app_id }: CommentFormProps) {
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { name: '', email: '', content: '' },
  });

  async function onSubmit(values: CommentFormValues) {
    setServerError(null);
    try {
      const payload: CommentPayload = {
        ...values,
        app_id,
      };
      await createComment(payload);
      setSubmitted(true);
      form.reset();
    } catch {
      // FIX: original had NO error path — silent failure
      setServerError('Something went wrong. Please try again in a moment.');
    }
  }

  return (
    <section className='mt-10 w-full' aria-labelledby={`${formId}-heading`}>
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
        <Card className='bg-white border border-slate-100 rounded-2xl shadow-sm'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              Leave a Comment
            </CardTitle>
          </CardHeader>

          <CardContent>
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
                  name='content'
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
          </CardContent>
        </Card>
      )}
    </section>
  );
}
