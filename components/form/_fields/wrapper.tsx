import React from 'react';

import { FieldGroup, FieldSet } from '@/components/ui/field';

export const FormWrapper: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <FieldSet>
      <FieldGroup className='gap-y-5'>{children}</FieldGroup>
    </FieldSet>
  );
};
