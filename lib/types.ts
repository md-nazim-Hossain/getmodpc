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
