import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchPageBySlug } from '../(pages)/[slug]/page';
import { ContactForm } from './_components/contact-form';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug('contact-us');

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description ?? undefined,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description ?? undefined,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const page = await fetchPageBySlug('contact-us');

  if (!page) {
    notFound();
  }
  return (
    <main className='min-h-screen'>
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
        <ContactForm />
      </section>
    </main>
  );
}
