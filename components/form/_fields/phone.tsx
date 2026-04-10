import { Options, useHookFormMask } from 'use-mask-input';

import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { type IFormPhone } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

export const FormPhone: IFormPhone = ({
  fieldProps,
  disabled,
  className,
  placeholder,
  register,
  ...props
}) => {
  const registerWithMask = useHookFormMask(register);

  const mask = '99999-999999';
  const maskOptions: Options = {
    autoUnmask: true,
  };

  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          {...fieldProps}
          type='text'
          placeholder={placeholder}
          disabled={disabled}
          className={cn(className, 'min-w-28')}
          {...registerWithMask(field.name, mask, {
            required: true,
            ...maskOptions,
          })}
        />
      )}
    </FormBase>
  );
};
