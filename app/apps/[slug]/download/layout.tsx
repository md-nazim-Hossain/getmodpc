import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getAppDetailsBySlug,
  getDownloadAppsBySlug,
} from '@/server/get/get-apps';

import SharedContent from './_components/shared-content';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
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

export default async function DownloadLayout({ params, children }: PageProps) {
  const { slug } = await params;

  const { data: app } = await getDownloadAppsBySlug(slug);

  // // FIX: original had no null guard — would crash on invalid slug
  if (!app) notFound();

  // const category = app. ?? 'Apps';

  return <SharedContent data={app}>{children}</SharedContent>;
}
