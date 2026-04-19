import Link from 'next/link';

import { LinkItem } from '@/types/global-settings.types';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialIconsProps {
  links: LinkItem[];
  className?: string;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
// Keyed by lowercase label from API (e.g. "Facebook" → "facebook").
// Add new entries here as the API introduces new social platforms.

type SocialIconKey =
  | 'facebook'
  | 'youtube'
  | 'telegram'
  | 'twitter'
  | 'x'
  | 'whatsapp';

const ICON_PATHS: Record<SocialIconKey, string> = {
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  telegram:
    'm9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z',
  facebook:
    'M0 12.067C0 18.034 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067',
  whatsapp:
    'M16.6 14c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5s.2-.3.4-.4c.1-.1.2-.3.2-.4.1-.1.1-.3 0-.4S9.7 8.5 9.5 8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3Q7 8.5 7 9.7c.1.9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2.9.4 1.4.5.5.2 1 .2 1.6.1.7-.1 1.3-.6 1.7-1.2.2-.4.2-.8.1-1.2zm2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2 5.5 0 9.9-4.4 9.9-9.9.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4',
  // X and Twitter share the same icon
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
};

// Brand colors per platform — fallback if API provides no color field
const BRAND_COLORS: Record<SocialIconKey, string> = {
  youtube: '#FF0000',
  telegram: '#00A1DC',
  facebook: '#0080FE',
  whatsapp: '#32D952',
  twitter: '#1DA1F2',
  x: '#000000',
};

function resolveIcon(label: string): { path: string; color: string } | null {
  const key = label.toLowerCase() as SocialIconKey;
  const path = ICON_PATHS[key];
  if (!path) return null;
  return { path, color: BRAND_COLORS[key] };
}

// ─── Component ────────────────────────────────────────────────────────────────

const SocialIcons: React.FC<SocialIconsProps> = ({ links, className }) => {
  if (!links.length) return null;

  return (
    <div className={cn('container', className)}>
      {links.map((social) => {
        const icon = resolveIcon(social.label);

        // Skip platforms we have no icon for rather than rendering broken UI
        if (!icon) return null;

        return (
          <Link
            key={social.label}
            href={social.url}
            target={social.is_open_new_tab ? '_blank' : undefined}
            rel='noopener noreferrer'
            aria-label={social.label}
            className='icon social-icon'
            style={{ '--social-color': icon.color } as React.CSSProperties}
          >
            <svg
              viewBox='0 0 24 24'
              fill='currentColor'
              className='h-8 w-8 text-white'
              aria-hidden='true'
            >
              <path d={icon.path} />
            </svg>
          </Link>
        );
      })}
    </div>
  );
};

export default SocialIcons;
