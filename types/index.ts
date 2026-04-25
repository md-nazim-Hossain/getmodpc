// ── Ad props (use new Ad shape from types/ads.ts) ────────────────────────────
import type { Ad } from './ads';

// types/index.ts
export type Platform = 'android' | 'windows' | 'apple';

export interface App {
  id: string;
  title: string;
  icon: string;
  banner: string;
  platform: Platform;
  downloads: number;
  extraInfo: string;
  category: string;
  version?: string;
  size?: string;
  rating?: number;
  isVerified?: boolean;
  updatedAt?: string;
  releaseDate?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  count?: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export type IValueLabel = { value: string; label: string };

export interface Testimonial {
  id: string;
  designation: string;
  name: string;
  content: string;
  image_url: string;
  company_logo: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

export interface AdCardProps {
  ad: Ad;
}
export interface AdsSectionProps {
  heading?: string;
  ads: Ad[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ReportReason {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
