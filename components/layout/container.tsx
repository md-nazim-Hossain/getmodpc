// components/layout/Container.tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'full';
}

export function Container({
  children,
  className,
  size = 'full',
  ...props
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-5xl',
    default: 'max-w-7xl',
    lg: 'max-w-[1400px]',
    xl: 'max-w-[1600px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
