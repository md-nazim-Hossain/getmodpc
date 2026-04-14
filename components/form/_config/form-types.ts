import { IValueLabel } from '@/types';
import { ControllerRenderProps, UseFormRegister } from 'react-hook-form';

import { ButtonProps } from '@/components/ui/button';
import { InputProps } from '@/components/ui/input';
import { SelectProps } from '@/components/ui/select';
import { TextareaProps } from '@/components/ui/textarea';

import { FormControlFunc } from '../_helper/form-base';

// ─── Existing field types ──────────────────────────────────────────────────────

export type IFormInput = FormControlFunc<{
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: ControllerRenderProps<any, any>
  ) => void;
  fieldProps?: InputProps;
}>;

export type IFormTextarea = FormControlFunc<{
  fieldProps?: TextareaProps;
  maxChars?: number;
}>;

export type IFormPhone = FormControlFunc<{
  register: UseFormRegister<any>;
  fieldProps?: InputProps;
}>;

export type IFormSelect = FormControlFunc<{
  fieldProps?: SelectProps;
  options: IValueLabel[];
  valueType?: 'string' | 'number';
  isLoading?: boolean;
}>;

// ─── Input Validation ─────────────────────────────────────────────────────────

/** Typed result returned from a validate call (server or client). */
export type ValidationResponse = {
  type: 'success' | 'error';
  message: string;
};

export type IFormInputValidation = FormControlFunc<{
  fieldProps?: InputProps;
  onValidate: (value: string) => void;
  /** Fire `onValidate` automatically when value reaches `valueLength` chars. @default false */
  autoValidate?: boolean;
  /** Character length that triggers auto-validate. @default 9 */
  valueLength?: number;
  validationResponse?: ValidationResponse;
  isValidating?: boolean;
  /** @default 'Validate' */
  buttonText?: string;
  buttonProps?: ButtonProps;
}>;

// ─── Student ID ───────────────────────────────────────────────────────────────

/** Masked 9-digit student ID input. Requires a FormProvider ancestor. */
export type IFormId = FormControlFunc<{
  fieldProps?: InputProps;
}>;

// ─── Double Select ────────────────────────────────────────────────────────────

/** A single sub-select rendered inside FormDoubleSelect. */
export type DoubleSelectItem = {
  /** RHF field name this select writes to. */
  name: string;
  options: IValueLabel[];
  placeholder?: string;
  defaultValue?: string;
};

/**
 * Two (or more) inline selects sharing one label and error row.
 * Each select controls its own named RHF field.
 * Requires a FormProvider ancestor.
 */
export type IFormDoubleSelect = FormControlFunc<{
  selectProps: DoubleSelectItem[];
}>;

// ─── Radio ────────────────────────────────────────────────────────────────────

/** A single radio option. Value may be a string or a boolean. */
export type RadioOption = {
  value: string | boolean;
  label: string;
};

export type IFormRadio = FormControlFunc<{
  options: RadioOption[];
  /**
   * Visual presentation of the options.
   * - `'radio'` — standard horizontal radio group (default)
   * - `'card'`  — full-width clickable cards with embedded radio
   * @default 'radio'
   */
  viewAs?: 'radio' | 'card';
}>;
// ─── Checkbox ─────────────────────────────────────────────────────────────────

/**
 * A single boolean checkbox.
 * No extra props beyond the shared `FormControlProps` — label, description,
 * required, optional, and info are all supported via FormBase.
 */
export type IFormCheckbox = FormControlFunc;
