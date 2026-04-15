import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BaseIconProps {
  /** Width and height in pixels (uniform). Default: 20 */
  size?: number | string;
  /** Icon color — applied as `fill` or `stroke`. Default: 'currentColor' */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Stroke width (for stroke-based icons). Default: 2 */
  strokeWidth?: number;
  /** viewBox override. Rarely needed; each icon sets its own. */
  viewBox?: string;
  /** aria-label for accessible icons. If omitted, icon is hidden from a11y tree. */
  ariaLabel?: string;
  /** SVG path children */
  children?: React.ReactNode;
}

// ─── BaseIcon ─────────────────────────────────────────────────────────────────

/**
 * Shared wrapper for all SVG icons.
 * Provides consistent sizing, color, accessibility, and class handling.
 */
export const BaseIcon: React.FC<BaseIconProps> = ({
  size = 20,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
  viewBox = '0 0 24 24',
  ariaLabel,
  children,
}) => {
  const a11yProps = ariaLabel
    ? { role: 'img' as const, 'aria-label': ariaLabel }
    : { 'aria-hidden': true as const, focusable: false };

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox={viewBox}
      fill={color}
      style={{ color }}
      strokeWidth={strokeWidth}
      className={className}
      {...a11yProps}
    >
      {children}
    </svg>
  );
};
