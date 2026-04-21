import type { Metadata } from 'next';

import { ContactFormValues } from '@/lib/schemas';

import { ContactForm } from './_components/contact-form';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us for any inquiries or support.',
};

// ─── Server action (replace with real implementation) ─────────────────────────

async function submitContact(payload: ContactFormValues): Promise<void> {
  'use server';
  // TODO: send email / write to DB / call external API
  console.log('Contact payload received:', payload);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <main className='min-h-screen bg-background'>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className='bg-white border-b border-slate-100'>
        <div className='container max-w-4xl mx-auto px-4 py-12 text-center flex flex-col'>
          <h1 className='text-4xl font-bold text-slate-900 tracking-tight'>
            Contact Us
          </h1>
          <p className='mt-3 text-base text-slate-500 max-w-md mx-auto'>
            Get in touch with us for any inquiries or support.
          </p>
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────────────── */}
      <section className='container max-w-4xl mx-auto px-4 py-12'>
        <ContactForm onSubmitAction={submitContact} />
      </section>
    </main>
  );
}
