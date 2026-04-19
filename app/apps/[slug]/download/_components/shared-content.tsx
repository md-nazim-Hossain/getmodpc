import React from 'react';

import {
  AppDownloadDetails,
  AppSetting,
  ButtonsSettingValue,
} from '@/types/types.app-details-download';
import { Info } from 'lucide-react';
import slugify from 'slugify';

import { Container } from '@/components/layout/container';
import RichTextViewer from '@/components/rich-text-viewer';
import SocialShare from '@/components/social-share';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';

import { RelatedApps } from '../../_components/related-apps';

interface SharedContentProps {
  data: AppDownloadDetails;
  children: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSetting<T>(settings: AppSetting[], key: string): T | undefined {
  return settings.find((s) => s.key === key)?.value as T | undefined;
}

const SharedContent: React.FC<SharedContentProps> = ({ data, children }) => {
  const { name, slug, settings, downloadFaqs, related, genre } = data;

  const buttonsSetting = getSetting<ButtonsSettingValue>(settings, 'buttons');
  const installationGuide = buttonsSetting?.installation_guideline ?? '';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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
                  href={`/category/${slugify(genre, {
                    lower: true,
                    trim: true,
                    strict: true,
                  })}`}
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  {genre}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/apps/${slug}`}
                  className='text-slate-500 hover:text-violet-600 transition-colors text-sm'
                >
                  {name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-800 font-medium text-sm truncate max-w-45'>
                  Download
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
          <div className='flex flex-col gap-6 w-full'>
            {children}
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
                <h2 className='text-2xl font-bold text-foreground'>
                  Download FAQs
                </h2>
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
          <div className='lg:sticky lg:top-16 self-start'>
            <RelatedApps apps={related?.byCategory ?? []} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SharedContent;
