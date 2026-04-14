import React from 'react';

import { FieldGroup, FieldSet } from '@/components/ui/field';

import { cn } from '@/lib/utils';

export const FormWrapper: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <FieldSet>
      <FieldGroup className={cn('gap-y-5', className)}>{children}</FieldGroup>
    </FieldSet>
  );
};
