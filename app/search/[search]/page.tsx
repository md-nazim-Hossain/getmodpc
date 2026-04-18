import type { Metadata } from 'next';

import { getAllAppsBySearch } from '@/server/get/get-apps';

import { Container } from '@/components/layout/container';
import Pagination from '@/components/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { AppSection } from '@/app/apps/[slug]/_components/app-section';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ search: string }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { search } = await params;

  return {
    title: `Search: ${search}`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { search: slug } = await params;

  const search = await searchParams;
  const page = Number(search?.page ? search?.page : 1);
  const {
    data: { apps, settings },
    meta,
  } = await getAllAppsBySearch(slug, page);
  // // FIX: original had no null guard — would crash on invalid slug
  // if (!app) notFound();

  const keyword = decodeURIComponent(slug);

  return (
    <div className='min-h-screen bg-slate-50/50'>
      {/* ── Sticky breadcrumb ──────────────────────────────────── */}
      <nav
        className='bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm'
        aria-label='Breadcrumb'
      >
        <Container className='py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/'
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/category'
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  Search
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-800 font-medium text-sm truncate max-w-45 capitalize'>
                  {keyword}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </nav>

      {/* ── Main ───────────────────────────────────────────────── */}
      <Container className='py-8'>
        <AppSection
          className='mt-0'
          title={`Search results for: ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`}
          apps={apps ?? []}
          settings={settings}
        />

        {meta && meta?.totalPages > 1 && <Pagination {...meta} />}
      </Container>
    </div>
  );
}
