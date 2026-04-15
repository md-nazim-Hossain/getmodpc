// components/cards/platform-icon.tsx
// ─── Extracted from app-card.tsx and hero-app-card.tsx where it was duplicated verbatim ───
import { EnumPlatformType } from '@/types/types.app';

// ─── Types ────────────────────────────────────────────────────────────────────

type IconSize = 'sm' | 'md';

interface PlatformIconProps {
  platform: EnumPlatformType;
  size?: IconSize;
}

interface PlatformListProps {
  platform: EnumPlatformType;
  size?: IconSize;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_CONFIG: Record<IconSize, { container: string; icon: string }> = {
  sm: { container: 'size-5', icon: 'size-4' }, // AppCard
  md: { container: 'size-7', icon: 'size-4' }, // HeroAppCard
};

// ─── SVG paths (single source of truth) ──────────────────────────────────────

const PLATFORM_PATHS: Record<EnumPlatformType, string> = {
  android:
    'M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203 c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203 c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099 c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937 c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399 C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998 l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232 c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957 c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345 c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976 S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983 c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156 c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226 v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z',
  windows:
    'M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z',
  ios: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
};

// ─── Per-platform viewBox ─────────────────────────────────────────────────────
// The new Android icon uses a 512×512 artboard; Windows and Apple use 24×24.

const PLATFORM_VIEWBOXES: Record<EnumPlatformType, string> = {
  android: '0 0 512 512',
  windows: '0 0 24 24',
  ios: '0 0 24 24',
};

const PLATFORM_LABELS: Record<EnumPlatformType, string> = {
  android: 'Android',
  windows: 'Windows',
  ios: 'iOS',
};

// ─── PlatformIcon ─────────────────────────────────────────────────────────────
// Single icon for one platform. Accessible: aria-label describes the platform.

export function PlatformIcon({
  platform,
  size = 'sm',
}: PlatformIconProps): React.JSX.Element {
  const { icon } = SIZE_CONFIG[size];
  // const color = PLATFORM_COLORS[platform];

  return (
    <span
      aria-label={PLATFORM_LABELS[platform]}
      // className={`inline-flex items-center justify-center ${container} rounded-full`}
      // style={{ backgroundColor: `${color}15` }}
    >
      <svg
        className={icon}
        viewBox={PLATFORM_VIEWBOXES[platform]}
        fill={'currentColor'}
        aria-hidden='true'
      >
        <path d={PLATFORM_PATHS[platform]} />
      </svg>
    </span>
  );
}

// ─── PlatformIconList ─────────────────────────────────────────────────────────
// Renders the full platform row — replaces the duplicated .map() in both cards.

export function PlatformIconList({
  platform,
  size = 'sm',
}: PlatformListProps): React.JSX.Element {
  return (
    <div
      className='flex items-center gap-2'
      role='list'
      aria-label='Available platforms'
    >
      <div key={platform} role='listitem'>
        <PlatformIcon platform={platform} size={size} />
      </div>
      <span className='text-muted-foreground capitalize text-xs '>
        {platform}
      </span>
    </div>
  );
}
