import { ButtonGroup } from '@/components/ui/button-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { IFormSelect } from '../_config/form-types';
import DeleteButton from '../_helper/delete-button';
import { FormBase } from '../_helper/form-base';

export const FormSelect: IFormSelect = ({
  fieldProps,
  options,
  disabled,
  placeholder = 'Select an option',
  isLoading,
  valueType,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) =>
        isLoading ? (
          <Skeleton className='bg-gradient h-9 w-full rounded border border-input' />
        ) : (
          <Select
            onValueChange={(value) => {
              if (valueType === 'number') {
                field.onChange(Number(value));
                fieldProps?.onValueChange?.(value);
              } else {
                field.onChange(value);
                fieldProps?.onValueChange?.(value);
              }
            }}
            defaultValue={field.value}
            disabled={disabled}
            {...field}
            value={field?.value?.toString()}
          >
            <ButtonGroup>
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              {field.value && (
                <DeleteButton
                  disabled={disabled}
                  onClick={() => field.onChange('')}
                />
              )}
            </ButtonGroup>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option?.value?.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    </FormBase>
  );
};
