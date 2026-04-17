'use client';

import React from 'react';

import { RotatingLines } from 'react-loader-spinner';

import { cn } from '@/lib/utils';

const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex h-screen items-center justify-center', className)}>
      <RotatingLines
        strokeColor='hsl(var(--primary))'
        visible={true}
        width='40'
        strokeWidth='3'
        animationDuration='0.75'
        ariaLabel='rotating-lines-loading'
      />
    </div>
  );
};

export default Loader;
