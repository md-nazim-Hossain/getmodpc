import { Checkbox } from '@/components/ui/checkbox';

import { type IFormCheckbox } from '../_config/form-types';
import { FormBase } from '../_helper/form-base';

/**
 * FormCheckbox
 *
 * A single boolean checkbox wired to a react-hook-form Controller field.
 * Renders in horizontal layout with the label to the right of the checkbox
 * (`controlFirst`) — the standard shadcn checkbox pattern.
 *
 * Stored value is a boolean (`true` / `false`).
 */
export const FormCheckbox: IFormCheckbox = (props) => (
  <FormBase {...props} horizontal controlFirst>
    {({ onChange, value, ...field }) => (
      <Checkbox
        {...field}
        checked={Boolean(value)}
        onCheckedChange={onChange}
      />
    )}
  </FormBase>
);
