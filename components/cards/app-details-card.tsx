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
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { BadgeCheck, Download, Globe, Send, Star } from 'lucide-react';
import slugify from 'slugify';
import { toast } from 'sonner';

import { createAppRating } from '@/server/post/create-app-rating';
import { createReport } from '@/server/post/create-report';

import { useScreenshotViewer } from '@/hooks/use-screenshot-viewer';

import { ReportAppFormValues, ReportAppPayload } from '@/lib/schemas';
import { formatDate, formatNumber, getStarFill, StarFill } from '@/lib/utils';

import { RatingAppDialog } from '@/app/apps/[slug]/_components/rating-app-dialog';
import { ReportAppDialog } from '@/app/apps/[slug]/_components/report-app-dialog';
import { ScreenshotDialog } from '@/app/apps/[slug]/_components/screenshot-dialog';

import RichTextViewer from '../rich-text-viewer';
import SocialShare from '../social-share';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { AppImage } from '../ui/app-image';
import TooltipWrapper from '../ui/tooltip-wrapper';

// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_CLASS: Record<StarFill, string> = {
  full: 'fill-amber-400 text-amber-400',
  half: 'fill-amber-200 text-amber-400',
  empty: 'fill-slate-200 text-slate-200',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({
  score,
  handleClick,
}: {
  score: string;
  handleClick?: () => void;
}) {
  const num = parseFloat(score);
  return (
    <div
      className='flex items-center gap-0.5 cursor-pointer'
      role='img'
      aria-label={`${score} out of 5 stars`}
      onClick={handleClick}
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

// ─── Main Component ───────────────────────────────────────────────────────────

interface AppDetailsCardProps {
  app: AppDetails;
  settings: Settings<any>[];
}

export function AppDetailsCard({ app, settings }: AppDetailsCardProps) {
  const modders = app.modders ?? [];
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
            <AppImage
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
        success: (res) => res?.message,
        error: (err) => err?.message,
      });
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const scoreNum = parseFloat(app.score_text);
  const voteLabel = app.ratings
    ? `${formatNumber(app.ratings)} Votes`
    : 'Votes';

  const primaryLink = `/apps/${app.slug}/download`;

  // Rating dialog state
  const [ratingOpen, setRatingOpen] = useState(false);

  const [ratingMessage, setRatingMessage] = useState<string | null>(null);

  async function handleRating() {
    setRatingOpen(false);
    setRatingMessage(null);

    try {
      const res = await createAppRating(app.id);
      setRatingMessage(res.message);
    } catch (error) {
      console.log({ error });
    } finally {
      setRatingOpen(true);
    }
  }

  const value = settings?.find((s) => s.key === 'icons')?.value;

  const verifiedBadgeIcon =
    value?.icons?.find(
      (i: { name: string }) => i?.name === 'verified_badge_icon'
    )?.url || '/icons/check.svg';

  const tooltipText = value?.verified_badge_tooltip_text || '';

  return (
    <>
      <article className='bg-white border border-border overflow-hidden rounded-2xl'>
        {/* ── 1. Banner ────────────────────────────────────────────── */}
        {app.header_image && (
          <div className='p-4 rounded-2xl'>
            <div className='relative w-full h-52 sm:h-160 overflow-hidden bg-muted rounded-2xl'>
              <AppImage
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
              <AppImage
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
              {app?.is_verified && (
                <span
                  role='button'
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
                  className='inline-flex items-center cursor-default'
                  aria-label='Verified badge'
                >
                  <TooltipWrapper message={parse(tooltipText)}>
                    <AppImage
                      src={verifiedBadgeIcon}
                      alt='Verified'
                      width={14}
                      height={14}
                      // Also stop pointer events reaching the Link
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                  </TooltipWrapper>
                </span>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {format(app.published_date ?? app.updated ?? '', 'MMMM d, yyyy')}
              <span>{` ( ${formatDate(app.published_date ?? app.updated ?? '')} ) `}</span>
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
        <div className='flex items-center justify-between px-4 pt-3 '>
          <div className='flex items-center gap-2 flex-wrap '>
            <StarRating handleClick={handleRating} score={app.score_text} />
            <span className='text-sm font-bold text-foreground'>
              {scoreNum.toFixed(1)} / 5
            </span>
            <span className='text-sm text-muted-foreground'>({voteLabel})</span>
          </div>
        </div>

        {/* ── 6. Social share ──────────────────────────────────────── */}
        <div className='px-4 py-3'>
          <SocialShare
            title={app.name}
            url={typeof window !== 'undefined' ? window.location.href : ''}
          />
        </div>

        {/* ── 7. Download buttons ──────────────────────────────────── */}
        <div className='grid grid-cols-2 border-b border-border'>
          {downloadButton?.is_enabled && (
            <Link
              href={primaryLink}
              className='flex items-center justify-center gap-2 py-4 bg-foreground hover:opacity-90 text-background text-sm font-bold transition-opacity border-r border-border'
            >
              <Download className='w-4 h-4' aria-hidden />
              {downloadButton?.label || 'Download Now'}
            </Link>
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
                  <AppImage
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
          {/* Modders */}
          {modders.length > 0 && (
            <Accordion
              type='single'
              defaultValue={modders[0]?.title ?? 'modders-0'}
              collapsible
              className='w-full mb-4'
            >
              {modders.map((m, _idx) => (
                <AccordionItem
                  key={m?.title ?? 'modders-' + _idx}
                  value={m?.title ?? 'modders-' + _idx}
                >
                  <AccordionTrigger className='text-sm font-medium text-left hover:no-underline bg-black text-white rounded-b-none h-9 py-2 px-4'>
                    {m?.title}
                  </AccordionTrigger>
                  <AccordionContent className='text-sm text-muted-foreground leading-relaxed px-4 py-2 border rounded-b-md'>
                    <RichTextViewer content={m?.descriptions ?? ''} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

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
          <Link
            href={primaryLink}
            className='flex items-center justify-center gap-2 w-full py-3.5 bg-foreground hover:opacity-90 text-background text-sm font-bold rounded transition-opacity'
          >
            <Download className='w-4 h-4' aria-hidden />
            Download Now
          </Link>
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

      {/* ── Rating dialog ─────────────────────────────────────────── */}
      <RatingAppDialog
        message={ratingMessage}
        open={ratingOpen}
        onOpenChange={setRatingOpen}
      />
    </>
  );
}
