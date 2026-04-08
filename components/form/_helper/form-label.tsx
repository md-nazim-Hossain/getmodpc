import type { ReactNode } from 'react';

import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import TooltipWrapper from '@/components/ui/tooltip-wrapper';

import { formatLabel } from '../_utils/formatLabel';

type Props = {
  name: string;
  label: ReactNode;
  disableLabel?: boolean;
  description?: ReactNode;
  optional?: boolean;
  required?: boolean;
  info?: ReactNode;
};

const FormLabel: React.FC<Props> = ({
  name,
  label,
  disableLabel,
  description,
  optional,
  required,
  info,
}) => {
  return (
    <FieldContent>
      {disableLabel === true ? null : (
        <FieldLabel htmlFor={name}>
          {label ? label : formatLabel(name)}
          {required && <span className='text-xs text-destructive'>*</span>}
          {optional ? (
            <span className='text-xs text-gray-400'>(Optional)</span>
          ) : (
            ''
          )}
          {info && (
            <TooltipWrapper message={info}>
              <Button
                type='button'
                size='icon'
                variant='ghost'
                className='size-fit'
              >
                <Info className='size-4' />
              </Button>
            </TooltipWrapper>
          )}
        </FieldLabel>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </FieldContent>
  );
};

export default FormLabel;
