import { notFound } from 'next/navigation';

import { getDownloadAppsBySlug } from '@/server/get/get-apps';

import AppDownloadContent from './_components/app-download-content';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: app } = await getDownloadAppsBySlug(slug);

  // // FIX: original had no null guard — would crash on invalid slug
  if (!app) notFound();

  // const category = app. ?? 'Apps';

  return <AppDownloadContent data={app} />;
}
