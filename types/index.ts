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
  author_name: string;
  author_image: string;
  designation: string;
  workplace_name: string;
  workplace_logo?: string;
  message: string;
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
