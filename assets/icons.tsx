import React from 'react';

import { BaseIcon, BaseIconProps } from './base-icon';

// Re-export types for consumers
export type { BaseIconProps };

// ─── Publisher ────────────────────────────────────────────────────────────────

export const PublisherIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 448 512' {...props}>
    <path d='M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z' />
  </BaseIcon>
);

// ─── Genre ────────────────────────────────────────────────────────────────────

export const GenreIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 512 512' {...props}>
    <path d='M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z' />
  </BaseIcon>
);

// ─── Size ─────────────────────────────────────────────────────────────────────

export const SizeIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 576 512' {...props}>
    <path d='M567.938 243.908L462.25 85.374A48.003 48.003 0 0 0 422.311 64H153.689a48 48 0 0 0-39.938 21.374L8.062 243.908A47.994 47.994 0 0 0 0 270.533V400c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V270.533a47.994 47.994 0 0 0-8.062-26.625zM162.252 128h251.497l85.333 128H376l-32 64H232l-32-64H76.918l85.334-128z' />
  </BaseIcon>
);

// ─── Version ──────────────────────────────────────────────────────────────────

export const VersionIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 320 512' {...props}>
    <path d='M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z' />
  </BaseIcon>
);

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 640 512' {...props}>
    <path d='M461.453,107.866c-38.887-55.395-97.018-92.33-163.685-104.003S163.879,7.177,108.485,46.064  C53.091,84.95,16.155,143.081,4.482,209.748l67.537,11.825C89.595,121.19,185.561,53.823,285.943,71.399  s167.75,113.542,150.173,213.924s-113.542,167.75-213.924,150.173c-15.5-2.714-30.404-7.308-44.516-13.701l27.664-35.299  L56.625,371.24l50.358,140.758l27.503-35.093c23.671,12.669,49.143,21.446,75.881,26.127  c66.667,11.673,133.889-3.315,189.283-42.201s92.33-97.017,104.002-163.684C515.326,230.482,500.339,163.26,461.453,107.866z' />
    <polygon points='383.961,288.066 225.077,288.066 225.077,129.182 270.786,129.182 270.786,242.357 383.961,242.357' />
  </BaseIcon>
);

// ─── ModeInfo ─────────────────────────────────────────────────────────────────

export const ModeInfoIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 512 512' {...props}>
    <path d='M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z' />
  </BaseIcon>
);

// ─── SourceOf ─────────────────────────────────────────────────────────────────

/**
 * SourceOf uses `stroke` instead of `fill` for its outer rect.
 * Accepts an optional `strokeColor` prop; falls back to `color`.
 */
export interface SourceOfIconProps extends BaseIconProps {
  strokeColor?: string;
}

export const SourceOfIcon: React.FC<SourceOfIconProps> = ({
  color = 'currentColor',
  strokeColor,
  strokeWidth = 2,
  ...props
}) => (
  <BaseIcon
    viewBox='0 0 24 24'
    color='none' // no global fill — managed per shape below
    strokeWidth={strokeWidth}
    {...props}
  >
    <rect
      x='3'
      y='3'
      width='18'
      height='18'
      rx='4'
      stroke={strokeColor ?? color}
      strokeWidth={strokeWidth}
      fill='none'
    />
    <rect x='7' y='7' width='4' height='4' rx='1' fill={color} />
    <rect x='13' y='7' width='4' height='4' rx='1' fill={color} />
    <rect x='7' y='13' width='4' height='4' rx='1' fill={color} />
    <rect x='13' y='13' width='4' height='4' rx='1' fill={color} />
  </BaseIcon>
);

// ─── Report ───────────────────────────────────────────────────────────────────

export const ReportIcon: React.FC<BaseIconProps> = (props) => (
  <BaseIcon viewBox='0 0 512 512' {...props}>
    <path d='M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7.2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8.2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24v112c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z' />
  </BaseIcon>
);

// ─── Namespace export (mirrors original `Icons` object) ───────────────────────

export const Icons = {
  Publisher: PublisherIcon,
  Genre: GenreIcon,
  Size: SizeIcon,
  Version: VersionIcon,
  Update: UpdateIcon,
  ModeInfo: ModeInfoIcon,
  SourceOf: SourceOfIcon,
  Report: ReportIcon,
} as const;

export default Icons;
