import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { cn } from '@/lib/utils';

import { type IFormRadio } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

/**
 * FormRadio
 *
 * Renders a group of radio options in one of two visual modes:
 *
 *   'radio' (default) — standard horizontal radio buttons using shadcn
 *                       RadioGroup / RadioGroupItem primitives.
 *
 *   'card'            — each option is a full-width clickable Card with an
 *                       embedded radio input. Selected card gets a primary
 *                       border + tinted background.
 *
 * `options` values may be `string` or `boolean`.
 * Boolean values are stored as booleans in RHF (not stringified).
 */
export const FormRadio: IFormRadio = ({
  options,
  viewAs = 'radio',
  ...props
}) => {
  if (viewAs === 'card') {
    return (
      <FormBase {...props}>
        {(field) => (
          <div className='space-y-2'>
            {options.map((option) => {
              const strValue = String(option.value);
              const isSelected = field.value === option.value;

              return (
                <Card
                  key={strValue}
                  className={cn(
                    'cursor-pointer p-3 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  )}
                  onClick={() => field.onChange(option.value)}
                >
                  <label className='flex cursor-pointer items-center gap-3'>
                    <input
                      type='radio'
                      name={field.name}
                      value={strValue}
                      checked={isSelected}
                      // onChange kept for native accessibility (keyboard, AT);
                      // the Card onClick handles the primary interaction.
                      onChange={() => field.onChange(option.value)}
                      className='cursor-pointer'
                    />
                    <span className='text-sm font-medium'>{option.label}</span>
                  </label>
                </Card>
              );
            })}
          </div>
        )}
      </FormBase>
    );
  }

  return (
    <FormBase {...props}>
      {(field) => (
        <RadioGroup
          value={String(field.value)}
          onValueChange={(value) => {
            // Preserve the original value type — booleans stay booleans.
            const original = options.find((o) => String(o.value) === value);
            field.onChange(original ? original.value : value);
          }}
          className='flex flex-wrap items-center gap-4'
        >
          {options.map((option) => {
            const strValue = String(option.value);
            return (
              <div key={strValue} className='flex items-center gap-2'>
                <RadioGroupItem
                  id={`${field.name}-${strValue}`}
                  value={strValue}
                />
                <Label
                  className='cursor-pointer text-sm'
                  htmlFor={`${field.name}-${strValue}`}
                >
                  {option.label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}
    </FormBase>
  );
};
