'use client';

// components/app/AppDetailsCard.tsx
//
// Changes from previous version:
//  - Screenshot thumbnails now OPEN the ScreenshotDialog on click
//  - useScreenshotViewer hook manages all dialog state
//  - ScreenshotDialog rendered at end of article (portal-free, z-index stacked)
//  - Thumbnail strip kept for navigation context (clicking thumb → opens dialog at that index)
//  - No UI/design changes to any other section
//
// NEW in this version:
//  - "Report App" row in the MetaTable now opens ReportAppDialog
//  - useReportDialog hook encapsulates open/close state
//  - ReportAppDialog rendered alongside ScreenshotDialog (outside article)
import { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  BaseIconProps,
  GenreIcon,
  ModeInfoIcon,
  PublisherIcon,
  ReportIcon,
  SizeIcon,
  SourceOfIcon,
  UpdateIcon,
  VersionIcon,
} from '@/assets';
import { Settings } from '@/types/home-apps.types';
import { AppDetails } from '@/types/types.app';
import {
  BadgeCheck,
  Download,
  Facebook,
  Globe,
  Mail,
  Send,
  Star,
  Twitter,
  Zap,
} from 'lucide-react';
import slugify from 'slugify';
import { toast } from 'sonner';

import { createReport } from '@/server/post/create-report';

import { useScreenshotViewer } from '@/hooks/use-screenshot-viewer';

import { ReportAppFormValues, ReportAppPayload } from '@/lib/schemas';
import { formatNumber, getStarFill, StarFill } from '@/lib/utils';

import { ReportAppDialog } from '@/app/apps/[slug]/_components/report-app-dialog';
import { ScreenshotDialog } from '@/app/apps/[slug]/_components/screenshot-dialog';

import RichTextViewer from '../rich-text-viewer';

// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_CLASS: Record<StarFill, string> = {
  full: 'fill-amber-400 text-amber-400',
  half: 'fill-amber-200 text-amber-400',
  empty: 'fill-slate-200 text-slate-200',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ score }: { score: string }) {
  const num = parseFloat(score);
  return (
    <div
      className='flex items-center gap-0.5'
      role='img'
      aria-label={`${score} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${STAR_CLASS[getStarFill(i, num)]}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

interface MetaRowItem {
  label: string;
  value: string | null | React.ReactNode | undefined;
  Icon: React.FC<BaseIconProps>;
  isBadge?: boolean;
  /** Renders value as a plain danger-styled button */
  isDanger?: boolean;
  /** Called when the danger button is clicked */
  onDangerClick?: () => void;
}

function MetaTable({ items }: { items: MetaRowItem[] }) {
  const visible = items.filter(
    (item): item is MetaRowItem & { value: string } => Boolean(item.value)
  );
  return (
    <dl>
      {visible.map(
        ({ label, value, Icon, isBadge, isDanger, onDangerClick }, idx) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 text-sm rounded-md ${
              idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <Icon />
            <dt className='w-24 sm:w-28 text-muted-foreground font-medium shrink-0 text-xs sm:text-sm'>
              {label}:
            </dt>
            <dd className='flex-1 min-w-0'>
              {isBadge ? (
                <span className='inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold'>
                  <svg
                    className='w-3.5 h-3.5'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    aria-hidden
                  >
                    <path d='M3.18 23.76a2 2 0 002.2-.22L18.08 16.2l-3.5-3.5-11.4 11.06zM20.54 9.22L17.2 7.3 13.38 11l3.82 3.82 3.34-1.92a2 2 0 000-3.68zM2 2.24v19.52L13.16 11 2 2.24zm1.18.76l11.4 8.24-3.54 3.54L3.18 3z' />
                  </svg>
                  {value}
                </span>
              ) : isDanger ? (
                <button
                  type='button'
                  onClick={onDangerClick}
                  className='text-foreground hover:text-destructive transition-colors font-medium'
                >
                  {value}
                </button>
              ) : (
                <span className='text-foreground font-medium truncate'>
                  {value}
                </span>
              )}
            </dd>
          </div>
        )
      )}
    </dl>
  );
}

interface SocialButtonProps {
  href: string;
  label: string;
  color: string;
  children: React.ReactNode;
}

function SocialButton({ href, label, color, children }: SocialButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target='_blank'
      rel='noopener noreferrer'
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90 ${color}`}
    >
      {children}
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface AppDetailsCardProps {
  app: AppDetails;
  settings: Settings<any>[];
}

export function AppDetailsCard({ app, settings }: AppDetailsCardProps) {
  const screenshots = app.screenshots ?? [];

  // Screenshot dialog state
  const viewer = useScreenshotViewer(screenshots.length);

  // Report dialog state
  const [reportOpen, setReportOpen] = useState(false);

  const settingsIconsValue = settings.find((s) => s.key === 'icons')?.value;
  const sourceIcon = settingsIconsValue?.icons.find(
    (i: any) => i?.name === 'source_of'
  );

  const settingsButtonsValue = settings.find((s) => s.key === 'buttons')?.value;

  const telegramButton = settingsButtonsValue?.telegram_button;
  const downloadButton = settingsButtonsValue?.download_button;

  const installationGuidelineText =
    settingsButtonsValue?.installation_guideline;

  const sourceLabel =
    app.source === 'play_store'
      ? 'Google Play'
      : app.source === 'lite_apks'
        ? 'APK'
        : 'Direct';

  const metaItems = useMemo<MetaRowItem[]>(
    () => [
      { label: 'App Name', value: app.name, Icon: Globe },
      {
        label: 'Publisher',
        value: (
          <Link href={`/developer/${encodeURIComponent(app.developer!)}`}>
            {app.developer}
          </Link>
        ),
        Icon: PublisherIcon,
      },
      {
        label: 'Genre',
        value: (
          <Link
            href={`/category/${slugify(app.genre!, {
              lower: true,
              trim: true,
              strict: true,
            })}`}
          >
            {app.genre}
          </Link>
        ),
        Icon: GenreIcon,
      },
      { label: 'Size', value: app.size, Icon: SizeIcon },
      { label: 'Version', value: app.version, Icon: VersionIcon },
      { label: 'Update', value: app.updated, Icon: UpdateIcon },
      { label: 'Mod Info', value: app.short_mode, Icon: ModeInfoIcon },
      {
        label: 'Source of',
        value: (
          <Link href={app.url} target='_blank'>
            <Image
              src={sourceIcon?.url}
              alt={sourceLabel}
              width={102}
              height={40}
            />
          </Link>
        ),
        Icon: SourceOfIcon,
        isBadge: false,
      },
      {
        label: 'Report',
        value: 'Report App',
        Icon: ReportIcon,
        isDanger: true,
        // ← wire up the click handler here; MetaTable stays data-driven
        onDangerClick: () => setReportOpen(true),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [app, sourceLabel]
  );

  const handleReportSubmit = async (values: ReportAppFormValues) => {
    try {
      const payload: ReportAppPayload = {
        ...values,
        app_id: app.id,
      };

      toast.promise(createReport(payload), {
        loading: 'Submitting report...',
        success: 'Report submitted successfully.',
        error: 'Something went wrong. Please try again in a moment.',
      });
    } catch (err) {
      toast.error('Something went wrong. Please try again in a moment.');
    }
  };

  const scoreNum = parseFloat(app.score_text);
  const voteLabel = app.ratings
    ? `${formatNumber(app.ratings)} Votes`
    : 'Votes';

  const primaryLink = `/apps/${app.slug}/download`;

  return (
    <>
      <article className='bg-white border border-border overflow-hidden rounded-2xl'>
        {/* ── 1. Banner ────────────────────────────────────────────── */}
        {app.header_image && (
          <div className='p-4 rounded-2xl'>
            <div className='relative w-full h-52 sm:h-160 overflow-hidden bg-muted rounded-2xl'>
              <Image
                src={app?.header_image}
                alt={`${app.name} banner`}
                fill
                priority
                sizes='(max-width: 768px) 100vw, 640px'
                className='object-cover'
              />
            </div>
          </div>
        )}

        {/* ── 2. App identity ──────────────────────────────────────── */}
        <div className='flex items-start gap-3 px-4 pb-3'>
          {app.icon && (
            <div className='relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-border shadow-sm'>
              <Image
                src={app.icon}
                alt={`${app.name} icon`}
                fill
                sizes='64px'
                className='object-cover'
              />
            </div>
          )}
          <div className='flex-1 min-w-0 pt-1'>
            <div className='flex items-center gap-1 flex-wrap'>
              <h1 className='text-sm sm:text-base font-bold text-foreground leading-snug truncate'>
                {app.name}
                {app.version ? ` v${app.version}` : ''}
                {app.short_mode ? ` (${app.short_mode})` : ''}
              </h1>
              {app.is_verified && (
                <Image
                  src='/icons/check.svg'
                  alt='Verified'
                  width={14}
                  height={14}
                />
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {app.updated ?? app.published_date ?? ''}
            </p>
          </div>
        </div>

        {/* ── 3. Tagline ───────────────────────────────────────────── */}
        {app.summary && (
          <div className='px-4 py-2.5 mx-4 mb-3 rounded border border-border bg-muted/40'>
            <p className='text-xs sm:text-sm italic text-muted-foreground leading-relaxed'>
              {app.summary}
            </p>
          </div>
        )}

        {/* ── 4. Metadata table ────────────────────────────────────── */}
        <div className='mt-4 px-4'>
          <MetaTable items={metaItems} />
        </div>

        {/* ── 5. Star rating + votes ────────────────────────────────── */}
        <div className='flex items-center justify-between px-4 pt-3'>
          <div className='flex items-center gap-2 flex-wrap'>
            <StarRating score={app.score_text} />
            <span className='text-sm font-bold text-foreground'>
              {scoreNum.toFixed(1)} / 5
            </span>
            <span className='text-sm text-muted-foreground'>({voteLabel})</span>
          </div>
        </div>

        {/* ── 6. Social share ──────────────────────────────────────── */}
        <div className='flex items-center gap-2 px-4 py-3 border-b border-border flex-wrap'>
          <SocialButton href='#' label='Share on Facebook' color='bg-[#1877F2]'>
            <Facebook className='w-3.5 h-3.5' aria-hidden />
            Share On Facebook
          </SocialButton>
          <SocialButton href='#' label='Share on Twitter' color='bg-[#1DA1F2]'>
            <Twitter className='w-3.5 h-3.5' aria-hidden />
            Twitter
          </SocialButton>
          <SocialButton
            href='#'
            label='Share on Pinterest'
            color='bg-[#E60023]'
          >
            <svg
              className='w-3.5 h-3.5'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden
            >
              <path d='M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z' />
            </svg>
            Pinterest
          </SocialButton>
          <SocialButton href='#' label='Share on LinkedIn' color='bg-[#0077B5]'>
            <svg
              className='w-3.5 h-3.5'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden
            >
              <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
            </svg>
            Linkedin
          </SocialButton>
          <SocialButton
            href={`mailto:?subject=${encodeURIComponent(app.name)}`}
            label='Share via Email'
            color='bg-slate-500'
          >
            <Mail className='w-3.5 h-3.5' aria-hidden />
            Email
          </SocialButton>
        </div>

        {/* ── 7. Download buttons ──────────────────────────────────── */}
        <div className='grid grid-cols-2 border-b border-border'>
          {downloadButton?.is_enabled && (
            <a
              href={primaryLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 py-4 bg-foreground hover:opacity-90 text-background text-sm font-bold transition-opacity border-r border-border'
            >
              <Download className='w-4 h-4' aria-hidden />
              {downloadButton?.label || 'Download Now'}
            </a>
          )}
          {telegramButton?.is_enabled && (
            <a
              href={telegramButton?.url}
              target={telegramButton?.is_open_new_tab ? '_blank' : '_self'}
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 py-4 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold transition-colors'
            >
              <Send className='w-4 h-4' aria-hidden />
              {telegramButton?.label || 'Fast Download'}
            </a>
          )}
        </div>

        {/* ── 8. Screenshot strip ──────────────────────────────────── */}
        {screenshots.length > 0 && (
          <div className='border-b border-border'>
            <div
              className='flex gap-2 px-3 py-3 overflow-x-auto bg-background'
              role='tablist'
              aria-label='App screenshots — click to enlarge'
            >
              {screenshots.map((src, i) => (
                <button
                  key={src}
                  role='tab'
                  aria-label={`Open screenshot ${i + 1} of ${screenshots.length}`}
                  onClick={() => viewer.open(i)}
                  className='relative shrink-0 w-20 h-32 overflow-hidden rounded border-2 border-border transition-all hover:border-cyan-500 hover:opacity-100 opacity-80 cursor-pointer group'
                >
                  <Image
                    src={src}
                    alt=''
                    fill
                    sizes='80px'
                    className='object-cover transition-transform duration-200 group-hover:scale-105'
                    aria-hidden
                  />
                  <div
                    className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors'
                    aria-hidden
                  />
                </button>
              ))}
            </div>
            <div className='h-1 bg-muted mx-3 rounded-full mb-2'>
              <div
                className='h-1 bg-cyan-400 rounded-full transition-all'
                style={{ width: `${(1 / screenshots.length) * 100}%` }}
                aria-hidden
              />
            </div>
          </div>
        )}

        {/* ── 9. Description ───────────────────────────────────────── */}
        <div className='px-4 py-5 border-b border-border'>
          <RichTextViewer content={app.description} />

          {/* <p className='text-sm text-foreground leading-relaxed whitespace-pre-line'>
            {app.description}
          </p> */}
        </div>

        {/* ── 10. Bottom CTA ───────────────────────────────────────── */}
        <div className='px-4 pt-5 pb-3 bg-background border-t border-border'>
          <h2 className='text-base font-bold text-foreground mb-4 flex items-center gap-1.5'>
            Download Now {app.name}
            {app.is_verified && (
              <BadgeCheck
                className='w-4 h-4 text-destructive shrink-0'
                aria-hidden
              />
            )}
          </h2>
          <a
            href={primaryLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 w-full py-3.5 bg-foreground hover:opacity-90 text-background text-sm font-bold rounded transition-opacity'
          >
            <Download className='w-4 h-4' aria-hidden />
            Download Now
          </a>
        </div>

        {/* ── 11. Install notes ────────────────────────────────────── */}
        <div className='px-4 pt-2 pb-6 text-sm text-muted-foreground'>
          <p className='mb-2 text-foreground/80'>
            You are now ready to download{' '}
            <strong className='font-semibold text-foreground'>
              {app.name}
            </strong>{' '}
            for free. Here are some notes:
          </p>
          <RichTextViewer content={installationGuidelineText} />

          {/* <ul className='list-disc list-inside space-y-1'>
            <li>Please check our installation guide.</li>
            <li>
              To check the CPU and GPU of your Android device, please use the
              CPU-Z app.
            </li>
            {app.os_version && <li>Requires {app.os_version} or higher.</li>}
            {app.size && <li>Download size: {app.size}.</li>}
          </ul> */}
        </div>
      </article>

      {/* ── Screenshot dialog ─────────────────────────────────────── */}
      <ScreenshotDialog
        screenshots={screenshots}
        appName={app.name}
        viewer={viewer}
      />

      {/* ── Report dialog ─────────────────────────────────────────── */}
      <ReportAppDialog
        appName={app.name}
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}
