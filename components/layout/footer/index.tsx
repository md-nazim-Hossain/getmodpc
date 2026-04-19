'use client';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { FooterValue, SocialLinksValue } from '@/types/global-settings.types';
import { toast } from 'sonner';

import { createAppRequest } from '@/server/post/create-app-request';

import SocialIcons from '@/components/layout/footer/social-icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserAppRequestDialog } from '@/components/user-app-request-dialog';

import { UserAppRequestFormValues } from '@/lib/schemas';

import { Container } from '../container';
import { IFooterLink } from './footer-data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterProps {
  footer: FooterValue | null;
  socialLinks: SocialLinksValue['social_links'];
}

// ─── CopyrightYear ────────────────────────────────────────────────────────────

function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function LinkIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4'
      aria-hidden='true'
    >
      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M12 16v-4M12 8h.01' />
    </svg>
  );
}

// ─── FooterNavGroup ───────────────────────────────────────────────────────────

interface FooterNavGroupProps {
  icon: React.ReactNode;
  headingId: string;
  label: string;
  links: ReadonlyArray<IFooterLink>;
}

function FooterNavGroup({
  icon,
  headingId,
  label,
  links,
}: FooterNavGroupProps) {
  return (
    <nav aria-labelledby={headingId}>
      <div className='flex items-center gap-2 mb-3'>
        {icon}
        <h3 id={headingId} className='text-sm font-semibold text-white'>
          {label}
        </h3>
      </div>
      <ul className='flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2'>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='text-sm text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ footer, socialLinks }: FooterProps) {
  const [open, setOpen] = useState(false);

  async function handleAppRequestSubmit(values: UserAppRequestFormValues) {
    try {
      toast.promise(createAppRequest(values), {
        loading: 'Submitting request...',
        success: (res) => res.message,
        error: (err) => err.message,
      });
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    }
  }

  // Map API footer_links → IFooterLink shape
  const footerLinks: IFooterLink[] = (footer?.footer_links ?? [])
    .filter((l) => l.is_enabled)
    .map((l) => ({ label: l.label, href: l.url }));

  // Active social links only
  const activeSocialLinks = socialLinks.filter((l) => l.is_enabled);

  return (
    <footer
      className='text-white bg-center bg-no-repeat pt-16 pb-16'
      aria-label='Site footer'
      style={{ backgroundImage: "url('/images/footer-bg.png')" }}
    >
      <Container size='xl'>
        {/* 1. Heading + CTA */}
        <div className='flex justify-between items-start'>
          <h2 className='text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl mb-10 sm:mb-16'>
            {footer?.footer_heading ?? 'Get started today'}
          </h2>
          <Button onClick={() => setOpen(true)}>
            <span className='hidden sm:inline-block'>Request an app</span>
            <span className='sm:hidden'>Request</span>
          </Button>
        </div>

        {/* 2. Logo — dynamic from settings, fallback to static asset */}
        <Link href='/' aria-label='Home' className='block relative mb-8'>
          <Image
            src={'/images/logo.webp'}
            alt='Logo'
            width={1440}
            height={329}
            className='w-full h-auto'
            priority
          />
        </Link>

        <Separator className='bg-white/15 mb-8' />

        {/* 3. Social icons — dynamic from settings */}
        <div className='mb-8'>
          <SocialIcons links={activeSocialLinks} />
        </div>

        <Separator className='bg-white/15' />

        {/* 4. Footer links — dynamic from settings */}
        <div className='flex flex-col gap-8 py-10 sm:flex-row sm:justify-between sm:items-start'>
          <FooterNavGroup
            icon={<LinkIcon />}
            headingId='footer-links-heading'
            label='Quick Links'
            links={footerLinks}
          />

          <UserAppRequestDialog
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleAppRequestSubmit}
          />
        </div>

        {/* 5. Copyright */}
        <p className='text-xs text-white/50 text-center'>
          GETMODPC &copy; 2010 – <CopyrightYear />
        </p>
      </Container>
    </footer>
  );
}
