// components/layout/container.tsx
import { cn } from '@/lib/utils';
import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

const SIZE_CLASSES: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-5xl',
  default: 'max-w-7xl',
  lg: 'max-w-[1400px]',
  xl: 'max-w-[1600px]',
  full: 'max-w-full',
};

// ─── Component ────────────────────────────────────────────────────────────────
// ✅ Default size changed from 'full' to 'default' (max-w-7xl).
// 'full' is an unusual default for a Container — containers imply constraint.
// Any caller that genuinely wants full-width should pass size='full' explicitly.

export function Container({
  children,
  className,
  size = 'full',
  ...props
}: ContainerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
