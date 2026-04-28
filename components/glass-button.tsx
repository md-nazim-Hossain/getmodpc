import React, { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import { ButtonProps } from './ui/button';

const GlassButton: React.FC<
  ButtonProps & {
    childrenClassName?: string;
  }
> = ({ className, children, childrenClassName, ...props }) => {
  return (
    <div
      className='glass-card-effect-wrapper'
      style={
        {
          '--glass-border-radius': '999px',
        } as CSSProperties
      }
    >
      <button
        className={cn(
          'glass-card',
          'font-medium! text-[10px]! md:text-sm!  relative z-10 ',
          className
        )}
        style={
          {
            '--glass-border-radius': '999px',
          } as CSSProperties
        }
        {...props}
      >
        <span
          className={cn(
            'flex! items-center justify-between gap-x-1 px-2.5 py-2 md:px-4 md:py-2.5',
            childrenClassName
          )}
        >
          {children}
        </span>
      </button>
      <div
        className='glass-card-shadow'
        style={
          {
            '--glass-border-radius': '999px',
          } as CSSProperties
        }
      ></div>
    </div>
  );
};

export default GlassButton;
