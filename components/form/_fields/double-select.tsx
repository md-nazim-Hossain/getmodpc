import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

import { type IFormDoubleSelect } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

/**
 * FormDoubleSelect
 *
 * Renders two (or more) inline Select fields that share a single label and
 * error row. Each select writes to its own named field in the RHF store via
 * `formContext.setValue`.
 *
 * Each entry in `selectProps` must supply:
 *   - `name`        — the RHF field name this select controls
 *   - `options`     — the list of selectable options
 *   - `placeholder` — (optional) placeholder text shown when no value is set
 *   - `defaultValue`— (optional) pre-selected value
 *
 * Relies on `useFormContext` — must be rendered inside a `<FormWrapper>` /
 * `FormProvider` ancestor.
 */
export const FormDoubleSelect: IFormDoubleSelect = ({
  selectProps,
  ...props
}) => {
  const formContext = useFormContext();

  // Register every sub-field so RHF tracks them even before they are touched.
  useEffect(() => {
    selectProps.forEach((sp) => formContext.register(sp.name));
    // We only register on mount; `selectProps` is expected to be a stable
    // reference (define it outside render or wrap in useMemo at the call site).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormBase {...props}>
      {() => (
        <div className='flex rounded-md shadow-xs'>
          {selectProps.map((sp, index) => {
            const isFirst = index === 0;
            const isLast = index === selectProps.length - 1;

            return (
              <Select
                key={sp.name}
                defaultValue={formContext.getValues(sp.name)}
                onValueChange={(value) =>
                  formContext.setValue(sp.name, value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id={sp.name}
                  className={cn(
                    'shadow-none focus-visible:z-10',
                    !isFirst && '-ms-px rounded-l-none',
                    !isLast && 'rounded-r-none'
                  )}
                >
                  <SelectValue placeholder={sp.placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {sp.options.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
        </div>
      )}
    </FormBase>
  );
};
