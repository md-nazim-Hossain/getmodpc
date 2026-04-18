'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  AppDownloadDetails,
  AppSetting,
  ButtonsSettingValue,
  IconsSettingValue,
} from '@/types/types.app-details-download';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { Download, Info, Send } from 'lucide-react';

import RichTextViewer from '@/components/rich-text-viewer';
import SocialShare from '@/components/social-share';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TooltipWrapper from '@/components/ui/tooltip-wrapper';

import { cn, formatDate } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppDownloadContentProps {
  data: AppDownloadDetails;
  shareUrl: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSetting<T>(settings: AppSetting[], key: string): T | undefined {
  return settings.find((s) => s.key === key)?.value as T | undefined;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppDownloadContent: React.FC<AppDownloadContentProps> = ({
  data,
  shareUrl,
}) => {
  const {
    name,
    icon,
    platform,
    is_verified,
    modders,
    links,
    settings,
    downloadFaqs,
  } = data;

  const iconsSetting = getSetting<IconsSettingValue>(settings, 'icons');
  const buttonsSetting = getSetting<ButtonsSettingValue>(settings, 'buttons');

  const verifiedBadgeIcon =
    iconsSetting?.icons.find((i) => i.name === 'verified_badge_icon')?.url ??
    '/icons/check.svg';
  const tooltipText = iconsSetting?.verified_badge_tooltip_text ?? '';

  const downloadBtn = buttonsSetting?.download_button;
  const telegramBtn = buttonsSetting?.telegram_button;
  const installationGuide = buttonsSetting?.installation_guideline ?? '';

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* ── App Identity Card ── */}
      <Card className='p-5 flex flex-col gap-4'>
        <div className='flex items-start gap-4'>
          {/* Icon */}
          <div className='relative size-20 shrink-0 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/10'>
            <Image
              src={icon}
              alt={`${name} icon`}
              fill
              className='object-cover'
              sizes='80px'
            />
          </div>

          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h1 className='text-xl font-bold text-foreground leading-tight'>
                {name}
              </h1>
              {is_verified && (
                <TooltipWrapper message={parse(tooltipText)}>
                  <Image
                    src={verifiedBadgeIcon}
                    alt='Verified'
                    width={18}
                    height={18}
                  />
                </TooltipWrapper>
              )}
            </div>

            <div className='mt-1.5'>
              {format(data.created_at, 'MMMM d, yyyy')}
              <span>{` ( ${formatDate(data.created_at)} ) `}</span>
              {/* <PlatformIconList platform={platform} size='sm' /> */}
            </div>
          </div>
        </div>

        {/* Modders */}
        {/* {modders.length > 0 && (
          <Accordion
            type='single'
            defaultValue={modders[0]?.title ?? 'modders-0'}
            collapsible
            className='w-full'
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
        )} */}

        <Accordion
          type='single'
          defaultValue={links[0]?.name ?? 'modders-0'}
          collapsible
          className='w-full'
        >
          {links.map((link, _idx) => (
            <AccordionItem
              key={link.name ?? 'links-' + _idx}
              value={link.name ?? 'links-' + _idx}
            >
              <AccordionTrigger className='text-sm font-medium text-left hover:no-underline bg-black text-white rounded-b-none h-9 py-2 px-4'>
                {link.name}
              </AccordionTrigger>
              <AccordionContent className='text-sm text-muted-foreground leading-relaxed px-4 py-4! h-fit! border rounded-b-md'>
                <Link
                  style={{
                    textDecoration: 'none',
                  }}
                  href={`${window.location.href}/progress`}
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'w-full h-fit! py-2! justify-between! gap-2',
                  })}
                >
                  <div>
                    <div className='flex items-start gap-2'>
                      <Download className='size-8!' />
                      <span className='flex flex-col font-normal text-sm '>
                        Download Now
                        {link.note && (
                          <span className='text-xs font-light'>
                            {link.note}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <Badge variant={'outline'}>{link.size}</Badge>
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Separator />

        {/* CTA Buttons */}
        <div>
          {telegramBtn?.is_enabled && (
            <Link
              href={telegramBtn.url}
              target={telegramBtn.is_open_new_tab ? '_blank' : undefined}
              rel='noopener noreferrer'
              className={cn(
                'mx-auto flex items-center justify-center gap-2 h-11 rounded-full font-semibold text-sm w-fit px-4 ',
                'bg-[#229ED9] text-white hover:bg-[#1a8ec4]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9] focus-visible:ring-offset-2'
              )}
            >
              <Send className='size-4' />
              {telegramBtn.label}
            </Link>
          )}
        </div>
      </Card>

      {/* ── Installation Guide ── */}
      {installationGuide && (
        <Card className='p-5'>
          <div className='flex items-center gap-2 mb-3'>
            <Info className='size-4 text-muted-foreground shrink-0' />
            <h2 className='text-sm font-semibold text-foreground'>
              You are now ready to download For free. Here are some notes:
            </h2>
          </div>
          <RichTextViewer content={installationGuide} />
        </Card>
      )}

      {/* ── FAQ ── */}
      {downloadFaqs?.length > 0 && (
        <Card className='p-5'>
          <h2 className='text-2xl font-bold text-foreground'>Download FAQs</h2>
          <Accordion
            type='single'
            defaultValue={downloadFaqs[0]?.id}
            collapsible
            className='w-full'
          >
            {downloadFaqs?.map((faq) => (
              <AccordionItem key={faq?.id} value={faq?.id}>
                <AccordionTrigger className='text-sm font-medium text-left hover:no-underline'>
                  {faq?.title}
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground leading-relaxed'>
                  <RichTextViewer content={faq?.content ?? ''} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}

      {/* ── Social Share ── */}
      <Card className='p-5'>
        <SocialShare url={shareUrl} title={name} />
      </Card>
    </div>
  );
};

export default AppDownloadContent;
