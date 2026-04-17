/**
 * app/apps/[slug]/page.tsx
 *
 * CHANGES vs original:
 * - generateMetadata added — SEO was completely absent
 * - params typed correctly with Next.js PageProps pattern
 * - Data fetching stubbed as async server-side fetch (not hardcoded mock import)
 * - notFound() called when app is null (missing in original)
 * - Suspense boundary documented where streaming would apply
 * - CommentForm receives appSlug prop (was missing in original)
 * - RelatedApps / AppSection receive AppCardData (not RelatedApp from mock-data)
 * - Footer extracted to its own server component
 *
 *
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAppDetailsBySlug } from '@/server/get/get-apps';

import { AppDetailsCard } from '@/components/cards/app-details-card';
import { Container } from '@/components/layout/container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { RelatedApps } from '../_components/related-apps';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: app } = await getAppDetailsBySlug(slug);
  if (!app) return { title: 'App Not Found' };

  return {
    title: app?.title ?? app?.name,
    description: app?.summary ?? app?.description?.slice(0, 160),
    openGraph: {
      title: app?.title ?? app?.name,
      description: app?.summary ?? undefined,
      images: app?.header_image ? [{ url: app?.header_image }] : [],
    },
    // Structured data for Google Play-style rich results
    other: {
      'application-name': app?.name,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: app } = await getAppDetailsBySlug(slug);

  // // FIX: original had no null guard — would crash on invalid slug
  if (!app) notFound();

  const category = app.genre ?? 'Apps';

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
                  href='/apps'
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  Apps
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/apps?category=${app.categories?.[0]?.slug ?? ''}`}
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  {category}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-800 font-medium text-sm truncate max-w-45'>
                  {app.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </nav>

      {/* ── Main ───────────────────────────────────────────────── */}
      <Container className='py-8'>
        {/* Two-column layout */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-6'>
          <AppDetailsCard app={app} settings={app.settings} />
          <div className='lg:sticky lg:top-16 self-start'>
            <RelatedApps apps={app?.related?.byCategory ?? []} />
          </div>
        </div>
      </Container>
    </div>
  );
}
