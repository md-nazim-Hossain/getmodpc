// lib/types.ts

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

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
}

export interface HeroSlide extends App {
  badge?: string;
  featured?: boolean;
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

export type IValueLabel = {
  value: string;
  label: string;
};

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

// types/ads.ts

export interface Ad {
  id: string;
  banner_image: string;
  banner_bg_color?: string; // optional per-card accent color
  title: string;
  description: string;
  cta_label: string;
  cta_link: string;
}

export interface AdCardProps {
  ad: Ad;
}

export interface AdsSectionProps {
  /** Optional heading above the carousel */
  heading?: string;
  ads: Ad[];
  /** Enable Swiper autoplay */
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

// Generic API Response Wrapper
export interface ReportReason {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
