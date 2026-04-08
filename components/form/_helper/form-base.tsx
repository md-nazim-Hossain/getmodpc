import type { ReactNode } from 'react';

import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type FieldError as IFieldError,
} from 'react-hook-form';

import { Field, FieldContent, FieldError } from '@/components/ui/field';

import FormLabel from './form-label';

export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  label?: ReactNode;
  disableLabel?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  info?: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
  disableError?: boolean;
};

export type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[number]['field'] & {
      'aria-invalid': boolean;
      id: string;
      error: IFieldError | undefined;
    }
  ) => ReactNode;
};

export function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  name,
  controlFirst,
  horizontal,
  label,
  description,
  disableLabel,
  disableError,
  info,
  optional,
  required,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <FormLabel
            {...{
              name,
              label,
              disableLabel,
              optional,
              required,
              info,
              description,
            }}
          />
        );
        const control = children({
          ...field,
          id: field.name,
          'aria-invalid': fieldState.invalid,
          error: fieldState.error,
        });
        const errorElem = !disableError && fieldState.invalid && (
          <FieldError className='text-xs' errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                <FieldContent>{labelElement}</FieldContent>
                {control}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}
