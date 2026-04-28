import type { Metadata } from 'next';

import { getAppsByDeveloper } from '@/server/get/get-apps';

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
  params: Promise<{ slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Developer: ${slug}`,
  };

  // return {
  //   title: ,
  //   description: app?.summary ?? app?.description?.slice(0, 160),
  //   openGraph: {
  //     title: app?.title ?? app?.name,
  //     description: app?.summary ?? undefined,
  //     images: app?.header_image ? [{ url: app?.header_image }] : [],
  //   },
  //   // Structured data for Google Play-style rich results
  //   other: {
  //     'application-name': app?.name,
  //   },
  // };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppDeveloperPage({ params }: PageProps) {
  const { slug } = await params;

  const {
    data: { apps, settings },
    meta,
  } = await getAppsByDeveloper(slug);

  // // FIX: original had no null guard — would crash on invalid slug
  // if (!app) notFound();

  const developer = decodeURIComponent(slug).replace('-', ' ');

  return (
    <div className='min-h-screen'>
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
                  href='/developer'
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  Developer
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-800 font-medium text-sm truncate max-w-45 capitalize'>
                  {developer}
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
          title={`${developer.charAt(0).toUpperCase() + developer.slice(1)}`}
          apps={apps ?? []}
          settings={settings}
        />

        {meta && meta?.totalPages > 1 && <Pagination {...meta} />}
      </Container>
    </div>
  );
}
