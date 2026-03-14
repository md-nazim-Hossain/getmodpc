import React from 'react';

import { cn } from '@/lib/utils';

const GlassButton: React.FC<{
  className?: string;

  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div className='glass-card-wrapper'>
      <button
        className={cn(
          'glass-card',
          'px-3! py-2! font-medium! text-sm! flex items-center justify-between gap-x-1 relative z-10 bg-primary! text-primary-foreground!',
          className
        )}
      >
        {children}
      </button>
      <div className='glass-card-shadow'></div>
    </div>
  );
};

export default GlassButton;
