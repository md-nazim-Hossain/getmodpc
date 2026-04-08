import { FieldError } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';

import { IFormTextarea } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

export const FormTextarea: IFormTextarea = ({
  fieldProps,
  className,
  disabled,
  placeholder,
  maxChars,
  ...props
}) => {
  return (
    <FormBase disableError {...props}>
      {(field) => (
        <div className='space-y-2'>
          <Textarea
            {...field}
            {...fieldProps}
            placeholder={placeholder}
            className={cn('resize-y', className)}
            disabled={disabled}
          />

          <div className='flex items-center justify-between'>
            {field['aria-invalid'] ? (
              <FieldError className='text-xs' errors={[field.error]} />
            ) : (
              maxChars && <span aria-hidden='true' />
            )}
            {maxChars && (
              <p
                id={field.id}
                className='text-xs text-gray-400 tabular-nums'
                aria-live={'polite'}
              >
                {field.value.length}/{maxChars}
              </p>
            )}
          </div>
        </div>
      )}
    </FormBase>
  );
};
