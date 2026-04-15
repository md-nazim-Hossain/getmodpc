import type { Accept } from 'react-dropzone';

import type { FormControlFunc } from '../_helper/form-base';

// ─── Domain types ──────────────────────────────────────────────────────────────

/**
 * Controls the icon and accept hint shown in the dropzone placeholder.
 * - 'all'      — no filtering, any file type is accepted (default)
 * - 'image'    — images only
 * - 'video'    — videos only
 * - 'document' — documents (pdf, docx, etc.)
 * - 'custom'   — caller supplies an explicit `accept` config (required)
 */
export type FileUploadVariant =
  | 'all'
  | 'image'
  | 'video'
  | 'document'
  | 'custom';

/**
 * Controls the value format stored in the RHF field after a file is selected.
 *
 * - 'file'   → stores the raw File object(s).
 *              Best for direct server upload via FormData. (default)
 *
 * - 'base64' → reads each file with FileReader.readAsDataURL and stores the
 *              resulting data URL string(s). Use this when the form value must
 *              be JSON-serialisable, e.g. for localStorage / sessionStorage
 *              persistence or when sending base64 payloads to an API.
 *
 * @default 'file'
 */
export type StoreAs = 'file' | 'base64';

export type UploadedFile = {
  readonly file: File;
  readonly preview: string;
  readonly id: string;
};

// Discriminated union — makes variant-specific logic exhaustive and type-safe.
// 'all' and named variants allow an optional accept override; 'custom' requires one.
export type FileUploadAcceptConfig =
  | { variant?: 'all'; accept?: Accept }
  | { variant: 'image'; accept?: Accept }
  | { variant: 'video'; accept?: Accept }
  | { variant: 'document'; accept?: Accept }
  | { variant: 'custom'; accept: Accept }; // custom requires explicit accept

// ─── Prop contracts ────────────────────────────────────────────────────────────

export type FileUploadRenderPreview = (
  files: readonly UploadedFile[],
  onRemove: (id: string) => void
) => React.ReactNode;

export type FileUploadOnChange = (files: File | File[] | null) => void;

/** Props exclusive to the file-upload field (beyond the shared FormControlProps) */
export type FormFileUploadExtraProps = FileUploadAcceptConfig & {
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  placeholder?: string;
  renderPreview?: FileUploadRenderPreview;
  onFilesChange?: FileUploadOnChange;
  /**
   * When true, the component treats the current RHF field value as a **server
   * file path** and renders a preview by prepending `NEXT_PUBLIC_API_URL`.
   * Only applies to plain string paths (e.g. `/uploads/avatar.jpg`).
   *
   * Base64 data URLs (storeAs='base64') are always previewed directly,
   * regardless of this flag — they need no URL prefix.
   *
   * Once the user picks a new file, the server preview is replaced by the
   * local object-URL preview as normal.
   * @default false
   */
  isUpdate?: boolean;
  /**
   * Controls the value format stored in the RHF field after a file is selected.
   * - 'file'   → raw File object(s) — default, use for direct server upload
   * - 'base64' → data URL string(s) — use for localStorage / JSON persistence
   * @default 'file'
   */
  storeAs?: StoreAs;
};

export type IFormFileUpload = FormControlFunc<FormFileUploadExtraProps>;
