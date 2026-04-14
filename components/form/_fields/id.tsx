import { useFormContext } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';

import { Input } from '@/components/ui/input';

import { type IFormId } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

/**
 * FormStudentId
 *
 * A masked 9-digit student ID input (format: 999999999).
 * Uses `use-mask-input` for digit-only enforcement and auto-unmask so the
 * stored RHF value is always the raw digit string, never the masked display.
 *
 * Relies on `useFormContext` — must be rendered inside a `<FormWrapper>` /
 * `FormProvider` ancestor.
 */
export const FormId: IFormId = ({ fieldProps, ...props }) => {
  const { register } = useFormContext();
  const registerWithMask = useHookFormMask(register);

  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          {...fieldProps}
          {...registerWithMask(field.name, '999999999', {
            required: true,
            placeholder: '_',
            autoUnmask: true,
          })}
          type='text'
        />
      )}
    </FormBase>
  );
};
