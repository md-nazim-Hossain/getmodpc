// components/layout/header.tsx
'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { Container } from './container';

// ─── SVG icons ────────────────────────────────────────────────────────────────
// Extracted to constants to avoid JSX re-creation on every render.

const MenuIcon = (
  <svg
    className='h-5 w-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 6h16M4 12h16M4 18h16'
    />
  </svg>
);

const CloseIcon = (
  <svg
    className='h-5 w-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

const SearchIcon = (
  <svg
    className='h-5 w-5'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    />
  </svg>
);

const LogoIcon = (
  <svg
    className='h-5 w-5 text-white'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const MOBILE_MENU_ID = 'mobile-navigation-menu';

export function Header(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className='sticky top-0 z-50 w-full backdrop-blur-xl bg-glass/80 border-b border-white/20'>
      <Container>
        <nav
          className='flex h-16 items-center justify-between'
          aria-label='Main navigation'
        >
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='h-9 w-9 rounded-xl bg-primary flex items-center justify-center'>
              {LogoIcon}
            </div>
            <span className='text-xl font-bold text-foreground'>
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:gap-1' role='list'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role='listitem'
                className='px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search & Actions */}
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='hidden sm:flex'
              aria-label='Search'
            >
              {SearchIcon}
            </Button>
            <Button className='hidden sm:inline-flex'>Get Started</Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={toggleMobileMenu}
              // ✅ aria-expanded + aria-controls — previously missing entirely.
              // Screen reader users now know this button controls a menu and its state.
              aria-expanded={mobileMenuOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
            >
              {mobileMenuOpen ? CloseIcon : MenuIcon}
            </Button>
          </div>
        </nav>

        {/*
          Mobile Menu
          ✅ Uses CSS grid row animation instead of max-h with a hardcoded magic value.
          grid-rows-[0fr]/grid-rows-[1fr] handles arbitrary content heights correctly.
          Previously max-h-64 would clip content if menu exceeded 256px.
        */}
        <div
          id={MOBILE_MENU_ID}
          className={cn(
            'md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out',
            mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div className='overflow-hidden'>
            <nav className='space-y-1 pt-2 pb-4' aria-label='Mobile navigation'>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='block px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors'
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <div className='pt-2 px-4'>
                <Button className='w-full' onClick={closeMobileMenu}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
