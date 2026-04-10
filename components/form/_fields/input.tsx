import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

import { cn } from '@/lib/utils';

import { type IFormInput } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

export const FormInput: IFormInput = ({
  fieldProps,
  disabled,
  className,
  onChange,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormBase {...props}>
      {(field) =>
        fieldProps?.type === 'password' ? (
          <InputGroup>
            <InputGroupInput
              {...field}
              {...fieldProps}
              placeholder={placeholder}
              disabled={disabled}
              className={cn('rounded-l', className)}
              type={showPassword ? 'text' : 'password'}
            />
            <InputGroupAddon align={'inline-end'} className='border-l'>
              <InputGroupButton
                aria-label='Toggle password visibility'
                title='Toggle password visibility'
                size='icon-xs'
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? (
                  <Eye className='size-4' />
                ) : (
                  <EyeOff className='size-4' />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ) : fieldProps?.type === 'number' ? (
          <Input
            {...field}
            {...fieldProps}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            value={
              field.value === null || field.value === '' || field.value === 0
                ? undefined
                : Number(field.value)
            }
            onChange={(e) => {
              if (onChange) {
                onChange(e, field);
              } else {
                field.onChange(Number(e.target.value));
              }
            }}
            onBlur={(e) => {
              if (onChange) {
                onChange(e, field);
              } else {
                field.onChange(Number(e.target.value));
              }
            }}
          />
        ) : (
          <Input
            {...field}
            {...fieldProps}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            value={field.value === null ? '' : field.value}
          />
        )
      }
    </FormBase>
  );
};
