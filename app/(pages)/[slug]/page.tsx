import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { Page } from '@/types/page.types';

import { getPagesBySlug } from '@/server/get/get-pages';

import { Container } from '@/components/layout/container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await getPagesBySlug(slug);

    if (!response.success || !response.data || !response.data.is_active) {
      return null;
    }

    return response.data;
  } catch {
    return null;
  }
}

/**
 * Sanitize HTML content before rendering.
 *
 * TODO: Replace with a proper sanitizer in production, e.g.:
 *   import sanitizeHtml from 'sanitize-html';
 *   return sanitizeHtml(rawHtml, { allowedTags: sanitizeHtml.defaults.allowedTags });
 */
function sanitizeHtml(rawHtml: string): string {
  return rawHtml;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageContent({ content }: { content: string }) {
  return (
    <div
      className='editor prose prose-slate prose-sm max-w-none
                 prose-headings:font-semibold prose-headings:text-slate-900
                 prose-h2:text-xl prose-h2:text-center prose-h2:mb-4
                 prose-p:text-sm prose-p:text-slate-700 prose-p:leading-relaxed
                 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                 space-y-3'
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className='min-h-screen bg-white'>
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <Container size='lg' className='py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Container>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Container size='lg' className='pb-8'>
        <div className='border border-slate-200 rounded-lg p-6 md:p-10'>
          <h1 className='text-3xl font-bold text-slate-900 mb-8'>
            {page.title}
          </h1>

          <PageContent content={page.content} />
        </div>
      </Container>
    </main>
  );
}
