'use client';

import { useId, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { FormInput, FormTextarea, FormWrapper } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { contactFormSchema, ContactFormValues } from '@/lib/schemas';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactFormProps {
  /** Optional: server action or fetch fn to submit contact data */
  onSubmitAction?: (payload: ContactFormValues) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactForm({ onSubmitAction }: ContactFormProps) {
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    try {
      const payload: ContactFormValues = {
        ...values,
      };
      await onSubmitAction?.(payload);
      setSubmitted(true);
      form.reset();
    } catch {
      setServerError('Something went wrong. Please try again in a moment.');
    }
  }

  return (
    <section
      className='w-full max-w-2xl mx-auto'
      aria-labelledby={`${formId}-heading`}
    >
      {submitted ? (
        <div
          role='status'
          aria-live='polite'
          className='flex flex-col items-center justify-center py-14 gap-3 bg-emerald-50 rounded-2xl border border-emerald-100'
        >
          <CheckCircle2 className='w-12 h-12 text-emerald-500' aria-hidden />
          <p className='text-xl font-semibold text-slate-700'>Message Sent!</p>
          <p className='text-sm text-slate-500 text-center max-w-xs'>
            Thank you for reaching out. We&apos;ll get back to you within 1–2
            business days.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <Card className='bg-white border border-slate-100 rounded-2xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle
              id={`${formId}-heading`}
              className='text-2xl font-bold text-slate-800'
            >
              Send us a message
            </CardTitle>
            <p className='text-sm text-slate-500 mt-1'>
              Fill in the form below and we&apos;ll respond as soon as possible.
            </p>
          </CardHeader>

          <CardContent className='pt-4'>
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
                  label='Your name'
                  placeholder='John Doe'
                />
                <FormInput
                  control={form.control}
                  name='email'
                  label='Your email'
                  placeholder='john@example.com'
                  fieldProps={{ type: 'email' }}
                />
                <FormTextarea
                  control={form.control}
                  name='message'
                  label='Your message (optional)'
                  placeholder='Tell us how we can help…'
                  maxChars={2000}
                />
              </FormWrapper>

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                aria-busy={form.formState.isSubmitting}
                className='w-full mt-6 bg-primary hover:bg-primary/90 text-white
                           font-semibold py-3 rounded-md text-sm sm:text-base
                           transition-colors duration-200 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2'
              >
                <Send className='w-4 h-4' aria-hidden />
                {form.formState.isSubmitting ? 'Sending…' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
