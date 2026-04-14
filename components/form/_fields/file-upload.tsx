import { useCallback } from 'react';

import { FileText, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

import {
  type FileUploadVariant,
  type IFormFileUpload,
} from '../_config/file-upload-types';
import { FormBase } from '../_helper/form-base';
import { useFileUpload } from '../_hooks/use-file-upload';
import { DropzonePlaceholder, FilePreviewList } from './file-preview';

// ─── Error message humanizer ──────────────────────────────────────────────────

function humanizeDropzoneError(
  code: string,
  fallbackMessage: string,
  maxSize?: number
): string {
  switch (code) {
    case 'file-too-large':
      return maxSize
        ? `File is too large. Maximum allowed size is ${formatBytes(maxSize)}.`
        : 'File is too large.';
    case 'file-too-small':
      return 'File is too small to be uploaded.';
    case 'file-invalid-type':
      return 'This file type is not supported. Please upload a valid file.';
    case 'too-many-files':
      return 'Too many files selected. Please reduce the number of files and try again.';
    default:
      return (
        fallbackMessage.replace(/\d+ bytes?/gi, '').trim() ||
        'This file could not be uploaded.'
      );
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

/** Derives a display filename from a base64 data URL using its MIME type. */
function deriveFileNameFromBase64(dataUrl: string): string {
  const mime = dataUrl.split(';')[0]?.split(':')[1] ?? '';
  const ext = mime.split('/')[1] ?? 'file';
  return `uploaded.${ext}`;
}

/**
 * Approximates the decoded byte size of a base64 data URL.
 *
 * Formula: every 4 base64 characters encode exactly 3 bytes.
 * Padding characters ('=') at the end each reduce the count by 1 byte.
 *
 * e.g. "data:image/jpeg;base64,/9j/4AAQ...==" → strip prefix → measure payload
 */
function deriveFileSizeFromBase64(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  const padding = (base64.match(/=+$/) ?? [''])[0].length;
  return Math.floor((base64.length * 3) / 4) - padding;
}

// ─── Server Preview ───────────────────────────────────────────────────────────

function ServerPreview({
  value,
  onReplace,
  disabled,
}: {
  value: string;
  onReplace: () => void;
  disabled?: boolean;
}) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${value}`;
  const ext = value.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(
    ext
  );
  const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);

  return (
    <div className='flex flex-col gap-2.5'>
      <div className='overflow-hidden rounded-lg border border-border/60 bg-muted/30'>
        {isImage ? (
          <img
            src={url}
            alt='Current file'
            className='max-h-48 w-full object-contain'
          />
        ) : isVideo ? (
          <video
            src={url}
            controls
            playsInline
            muted
            className='max-h-48 w-full rounded-lg object-contain'
          />
        ) : (
          <div className='flex items-center gap-3 px-3 py-2.5'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
              <FileText className='size-5 text-muted-foreground' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-foreground'>
                {value.split('/').pop()}
              </p>
              <p className='mt-0.5 text-xs text-muted-foreground uppercase'>
                {ext}
              </p>
            </div>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='shrink-0 text-xs text-primary hover:underline'
              onClick={(e) => e.stopPropagation()}
            >
              Open
            </a>
          </div>
        )}
      </div>
      {!disabled && (
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            onReplace();
          }}
          className='flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
        >
          <UploadCloud className='size-3.5' />
          Replace file
        </button>
      )}
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export const FormFileUpload: IFormFileUpload = ({
  multiple = false,
  accept,
  variant = 'all',
  maxSize,
  maxFiles,
  placeholder,
  renderPreview,
  onFilesChange,
  isUpdate = false,
  storeAs = 'file',
  disabled,
  className,
  ...baseProps
}) => (
  <FormBase {...baseProps} disabled={disabled}>
    {(field) => (
      <FileUploadZone
        field={field}
        multiple={multiple}
        accept={accept}
        variant={variant}
        maxSize={maxSize}
        maxFiles={maxFiles}
        placeholder={placeholder}
        renderPreview={renderPreview}
        onFilesChange={onFilesChange}
        isUpdate={isUpdate}
        storeAs={storeAs}
        disabled={disabled}
        className={className}
        isInvalid={field['aria-invalid']}
      />
    )}
  </FormBase>
);

// ─── Zone (internal — not exported) ──────────────────────────────────────────

type FileUploadZoneProps = {
  field: any;
  multiple: boolean;
  accept?: import('react-dropzone').Accept;
  variant: FileUploadVariant;
  maxSize?: number;
  maxFiles?: number;
  placeholder?: string;
  renderPreview?: import('../_config/file-upload-types').FileUploadRenderPreview;
  onFilesChange?: import('../_config/file-upload-types').FileUploadOnChange;
  isUpdate: boolean;
  storeAs: import('../_config/file-upload-types').StoreAs;
  disabled?: boolean;
  className?: string;
  isInvalid?: boolean;
};

function FileUploadZone({
  field,
  multiple,
  accept,
  variant,
  maxSize,
  maxFiles,
  placeholder,
  renderPreview,
  onFilesChange,
  isUpdate,
  storeAs,
  disabled,
  className,
  isInvalid,
}: FileUploadZoneProps) {
  const { uploadedFiles, addFiles, removeFile } = useFileUpload({
    multiple,
    field,
    storeAs,
    onFilesChange,
  });

  const onDrop = useCallback(
    (accepted: File[]) => addFiles(accepted),
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections, open } =
    useDropzone({
      onDrop,
      accept,
      multiple,
      maxSize,
      maxFiles: multiple ? maxFiles : 1,
      disabled,
      noClick: true,
    });

  const hasNewFiles = uploadedFiles.length > 0;

  // A server path is a plain string that is NOT a base64 data URL.
  // When storeAs='base64' the field value is "data:image/...;base64,..." — that
  // must never be treated as a server path and passed to ServerPreview.
  const fieldString = typeof field.value === 'string' ? field.value : null;
  const isBase64Value = fieldString?.startsWith('data:') ?? false;
  const serverValue = fieldString && !isBase64Value ? fieldString : null;

  // Show the server preview only when:
  //   isUpdate=true  AND  field holds a plain server path  AND  no new file picked yet
  const showServerPreview = isUpdate && Boolean(serverValue) && !hasNewFiles;

  // When the field holds a data URL and no new file has been picked yet,
  // wrap it in a synthetic UploadedFile so it flows through the identical
  // renderFiles → FilePreviewList path as a freshly picked file.
  // This gives the exact same UI regardless of how the value got into the field.
  // isUpdate is irrelevant here — it only guards server-path previews.
  const syntheticFiles: import('../_config/file-upload-types').UploadedFile[] =
    isBase64Value && !hasNewFiles && fieldString
      ? [
          {
            id: 'base64-persisted',
            preview: fieldString, // data URL is a valid img/video src
            file: new File(
              // Pass a single-element array whose byteLength matches the decoded
              // base64 payload so file.size reports the correct value.
              [new Uint8Array(deriveFileSizeFromBase64(fieldString))],
              deriveFileNameFromBase64(fieldString),
              { type: fieldString.split(';')[0]?.split(':')[1] ?? '' }
            ),
          },
        ]
      : [];

  const hasContent =
    showServerPreview || syntheticFiles.length > 0 || hasNewFiles;
  const hasErrors = fileRejections.length > 0;

  const handleZoneClick = useCallback(() => {
    if (!disabled && !hasContent) open();
  }, [disabled, hasContent, open]);

  const renderFiles = (files: typeof uploadedFiles) =>
    renderPreview ? (
      renderPreview(files, removeFile)
    ) : (
      <FilePreviewList
        files={files}
        variant={variant}
        onRemove={removeFile}
        disabled={disabled}
      />
    );

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {/* Dropzone border */}
      <div
        {...getRootProps()}
        onClick={handleZoneClick}
        className={cn(
          'relative rounded-xl border-2 border-dashed outline-none transition-all duration-200',
          !isDragActive &&
            !isInvalid &&
            !disabled &&
            'border-border/70 hover:border-primary/40 hover:bg-primary/[0.02]',
          isDragActive && 'scale-[0.995] border-primary/60 bg-primary/[0.03]',
          isInvalid && 'border-destructive/60 bg-destructive/[0.02]',
          disabled && 'cursor-not-allowed border-border/40 opacity-50',
          !hasContent && !disabled ? 'cursor-pointer' : 'cursor-default'
        )}
        aria-invalid={isInvalid}
        aria-disabled={disabled}
      >
        <input {...getInputProps()} aria-label='File upload input' />

        {showServerPreview ? (
          /* ── Server path preview (isUpdate + plain string value) ── */
          <div className='p-3'>
            <ServerPreview
              value={serverValue!}
              onReplace={open}
              disabled={disabled}
            />
          </div>
        ) : syntheticFiles.length > 0 ? (
          /* ── Base64 persisted preview — same UI as a freshly picked file ── */
          <div className='p-3'>
            {renderFiles(syntheticFiles)}
            {!disabled && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className='mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              >
                <UploadCloud className='size-3.5' />
                Replace file
              </button>
            )}
          </div>
        ) : !multiple && hasNewFiles ? (
          /* ── Newly picked file — single mode ── */
          <div className='p-3'>
            {renderFiles(uploadedFiles)}
            {!disabled && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className='mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              >
                <UploadCloud className='size-3.5' />
                Replace file
              </button>
            )}
          </div>
        ) : (
          /* ── Empty state ── */
          <DropzonePlaceholder
            variant={variant}
            isDragActive={isDragActive}
            placeholder={placeholder}
            multiple={multiple}
          />
        )}
      </div>

      {/* Multi mode: local previews live outside the dropzone */}
      {multiple && hasNewFiles && (
        <div className='flex flex-col gap-1.5'>
          {renderFiles(uploadedFiles)}
        </div>
      )}

      {/* Rejection errors — humanized, grouped by file */}
      {hasErrors && (
        <div className='rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5'>
          <ul className='space-y-1.5'>
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name} className='text-xs text-destructive'>
                <span className='font-medium'>{file.name}</span>
                <ul className='mt-0.5 space-y-0.5 pl-3'>
                  {errors.map((err) => (
                    <li key={err.code} className='flex items-start gap-1.5'>
                      <span className='mt-px shrink-0 leading-none'>•</span>
                      <span>
                        {humanizeDropzoneError(err.code, err.message, maxSize)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
