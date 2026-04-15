/**
 * file-preview.tsx
 *
 * Rendering-only components: no form state, no dropzone — pure display.
 *
 * Preview support:
 *  - Images  → full-screen lightbox, keyboard nav, thumbnail strip
 *  - Videos  → full-screen modal with native <video> player
 *  - PDFs    → full-screen modal with native <iframe> viewer
 *  - Other docs → full-screen modal with download-only fallback
 *
 * All top-level exports are memo-wrapped. Modals are portal-based with
 * scroll-lock and Esc-to-close keyboard handling.
 */
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  FolderOpen,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

import type {
  FileUploadVariant,
  UploadedFile,
} from '../_config/file-upload-types';

// ─── File-type helpers ────────────────────────────────────────────────────────

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}
function isVideoFile(file: File) {
  return file.type.startsWith('video/');
}
function isPdfFile(file: File) {
  return file.type === 'application/pdf';
}
function isDocumentFile(file: File) {
  return (
    isPdfFile(file) ||
    file.type.startsWith('application/') ||
    file.type.startsWith('text/')
  );
}

// ─── Media Viewer (unified portal for image / video / document) ───────────────

type MediaViewerFile = {
  uploadedFile: UploadedFile;
  /** Siblings of the same type for prev/next navigation (images only) */
  siblings?: readonly UploadedFile[];
  siblingIndex?: number;
};

type MediaViewerProps = MediaViewerFile & {
  onClose: () => void;
  onNavigate?: (index: number) => void;
};

/**
 * Single portal that adapts its content based on file MIME type:
 *   image  → zoomable <img> with prev/next and thumbnail strip
 *   video  → native <video> with controls
 *   PDF    → <iframe> with 100% width/height
 *   other  → icon + filename + download button
 */
const MediaViewer = memo(
  ({
    uploadedFile,
    siblings = [],
    siblingIndex = 0,
    onClose,
    onNavigate,
  }: MediaViewerProps) => {
    const { file, preview } = uploadedFile;
    const titleId = useId();
    const isImage = isImageFile(file);
    const isVideo = isVideoFile(file);
    const isPdf = isPdfFile(file);
    const hasSiblings = siblings.length > 1 && isImage;
    const hasPrev = hasSiblings && siblingIndex > 0;
    const hasNext = hasSiblings && siblingIndex < siblings.length - 1;

    // Scroll lock
    useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, []);

    // Keyboard: Esc to close, arrows to navigate (images only)
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        if (!isImage || !onNavigate) return;
        if (e.key === 'ArrowLeft' && hasPrev) onNavigate(siblingIndex - 1);
        if (e.key === 'ArrowRight' && hasNext) onNavigate(siblingIndex + 1);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [isImage, hasPrev, hasNext, siblingIndex, onClose, onNavigate]);

    return createPortal(
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='fixed inset-0 z-50 flex flex-col bg-black/92 animate-in fade-in duration-200'
        onClick={onClose}
      >
        {/* ── Top bar ── */}
        <div
          className='flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3.5'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex min-w-0 flex-col'>
            <span
              id={titleId}
              className='max-w-sm truncate text-sm font-medium text-white/90'
            >
              {file.name}
            </span>
            <span className='mt-0.5 text-xs text-white/40'>
              {formatFileSize(file.size)}
              {hasSiblings && (
                <span className='ml-2'>
                  {siblingIndex + 1} / {siblings.length}
                </span>
              )}
            </span>
          </div>

          <div
            className='flex items-center gap-2'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Download — always available */}
            <a
              href={preview}
              download={file.name}
              aria-label={`Download ${file.name}`}
              className='flex size-8 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all hover:bg-white/15 hover:text-white'
            >
              <Download className='size-4' />
            </a>
            <ViewerIconButton aria-label='Close preview' onClick={onClose}>
              <X className='size-4' />
            </ViewerIconButton>
          </div>
        </div>

        {/* ── Content area ── */}
        <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
          {/* Prev button */}
          {hasPrev && onNavigate && (
            <ViewerIconButton
              aria-label='Previous'
              className='absolute left-4 z-10 size-10'
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(siblingIndex - 1);
              }}
            >
              <ChevronLeft className='size-5' />
            </ViewerIconButton>
          )}

          {/* Next button */}
          {hasNext && onNavigate && (
            <ViewerIconButton
              aria-label='Next'
              className='absolute right-4 z-10 size-10'
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(siblingIndex + 1);
              }}
            >
              <ChevronRight className='size-5' />
            </ViewerIconButton>
          )}

          {/* Content — switches on MIME type */}
          <div
            className={cn(
              'flex size-full items-center justify-center',
              isImage || isVideo ? 'p-6' : 'p-4'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {isImage ? (
              <img
                src={preview}
                alt={file.name}
                className='max-h-full max-w-full rounded-xl object-contain'
              />
            ) : isVideo ? (
              <VideoPlayer src={preview} fileName={file.name} />
            ) : isPdf ? (
              <PdfViewer src={preview} fileName={file.name} />
            ) : (
              <DocumentFallback file={file} preview={preview} />
            )}
          </div>
        </div>

        {/* ── Thumbnail strip (images only, multi-file) ── */}
        {hasSiblings && (
          <div
            className='flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3'
            onClick={(e) => e.stopPropagation()}
          >
            {siblings.map((img, i) => (
              <button
                key={img.id}
                type='button'
                onClick={() => onNavigate?.(i)}
                aria-label={`View ${img.file.name}`}
                aria-current={i === siblingIndex ? 'true' : undefined}
                className={cn(
                  'size-10 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  i === siblingIndex
                    ? 'border-white/80 opacity-100'
                    : 'border-transparent opacity-40 hover:opacity-70'
                )}
              >
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className='size-full object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>,
      document.body
    );
  }
);
MediaViewer.displayName = 'MediaViewer';

// ─── Video Player ─────────────────────────────────────────────────────────────

const VideoPlayer = memo(
  ({ src, fileName }: { src: string; fileName: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-play when modal opens; pause on unmount
    useEffect(() => {
      videoRef.current?.play().catch(() => {
        /* user may block autoplay — that's fine */
      });
      return () => {
        videoRef.current?.pause();
      };
    }, [src]);

    return (
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        className='max-h-full max-w-full rounded-xl shadow-2xl'
        aria-label={fileName}
      >
        Your browser does not support the video element.
      </video>
    );
  }
);
VideoPlayer.displayName = 'VideoPlayer';

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

const PdfViewer = memo(
  ({ src, fileName }: { src: string; fileName: string }) => (
    <div className='flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl'>
      <iframe
        src={`${src}#toolbar=1&navpanes=0`}
        title={fileName}
        className='flex-1 border-none'
        aria-label={`PDF preview: ${fileName}`}
      />
    </div>
  )
);
PdfViewer.displayName = 'PdfViewer';

// ─── Document Fallback (non-PDF: docx, xlsx, txt, etc.) ──────────────────────

const DocumentFallback = memo(
  ({ file, preview }: { file: File; preview: string }) => {
    const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
    const Icon = getDocumentIcon(file);

    return (
      <div className='flex max-w-sm flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-10 py-12 text-center'>
        <div className='flex size-20 items-center justify-center rounded-2xl bg-white/10'>
          <Icon className='size-10 text-white/70' />
        </div>

        <div className='space-y-1.5'>
          <p className='text-base font-medium text-white/90 break-all'>
            {file.name}
          </p>
          <p className='text-sm text-white/40'>{formatFileSize(file.size)}</p>
          <p className='mt-2 text-xs text-white/30'>
            This file type cannot be previewed in the browser.
          </p>
        </div>

        {/* Extension badge */}
        <div className='rounded-lg border border-white/10 bg-white/10 px-3 py-1'>
          <span className='text-xs font-semibold tracking-widest text-white/60'>
            {ext}
          </span>
        </div>

        <a
          href={preview}
          download={file.name}
          className='flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/15 hover:text-white active:scale-95'
        >
          <Download className='size-4' />
          Download file
        </a>
      </div>
    );
  }
);
DocumentFallback.displayName = 'DocumentFallback';

// ─── Shared Viewer Icon Button ────────────────────────────────────────────────

type ViewerIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
const ViewerIconButton = ({
  className,
  children,
  ...rest
}: ViewerIconButtonProps) => (
  <button
    type='button'
    className={cn(
      'flex size-8 items-center justify-center rounded-lg',
      'bg-white/10 text-white/80 transition-all hover:bg-white/15 hover:text-white',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

// ─── File Preview Item (list row) ─────────────────────────────────────────────

type FilePreviewItemProps = {
  uploadedFile: UploadedFile;
  variant: FileUploadVariant;
  onRemove: (id: string) => void;
  onPreview?: () => void;
  disabled?: boolean;
};

export const FilePreviewItem = memo(
  ({
    uploadedFile,
    variant,
    onRemove,
    onPreview,
    disabled,
  }: FilePreviewItemProps) => {
    const { file, preview, id } = uploadedFile;
    const isImage = variant === 'image' || isImageFile(file);
    const isVideo = variant === 'video' || isVideoFile(file);
    const isDocument = isDocumentFile(file);
    const ext = file.name.split('.').pop()?.toUpperCase() ?? '—';
    const canPreview = Boolean(onPreview);

    const handleThumbClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onPreview?.();
      },
      [onPreview]
    );

    const handleThumbKey = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPreview?.();
        }
      },
      [onPreview]
    );

    return (
      <div className='group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/30'>
        {/* Thumbnail */}
        <div
          role={canPreview ? 'button' : undefined}
          tabIndex={canPreview ? 0 : undefined}
          aria-label={canPreview ? `Preview ${file.name}` : undefined}
          onClick={canPreview ? handleThumbClick : (e) => e.stopPropagation()}
          onKeyDown={canPreview ? handleThumbKey : undefined}
          className={cn(
            'relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted',
            canPreview && 'cursor-pointer'
          )}
        >
          {isImage ? (
            <>
              <img
                src={preview}
                alt={file.name}
                className='size-full object-cover'
              />
              {canPreview && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30'>
                  <ZoomIn className='size-3.5 text-white opacity-0 transition-opacity group-hover:opacity-100' />
                </div>
              )}
            </>
          ) : isVideo ? (
            <VideoThumbnail src={preview} canPreview={canPreview} />
          ) : (
            <DocumentThumbnail file={file} ext={ext} canPreview={canPreview} />
          )}
        </div>

        {/* Metadata */}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium leading-tight text-foreground'>
            {file.name}
          </p>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {getFileTypeLabel(file)} · {formatFileSize(file.size)}
          </p>
        </div>

        {/* Actions — reveal on hover */}
        <div className='flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100'>
          {canPreview && (
            <PreviewActionButton
              aria-label={`Preview ${file.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onPreview!();
              }}
            >
              {isVideo ? (
                <FileVideo className='size-3.5' />
              ) : isDocument ? (
                <FileText className='size-3.5' />
              ) : (
                <ZoomIn className='size-3.5' />
              )}
            </PreviewActionButton>
          )}
          {!disabled && (
            <PreviewActionButton
              aria-label={`Remove ${file.name}`}
              variant='destructive'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
            >
              <X className='size-3.5' />
            </PreviewActionButton>
          )}
        </div>
      </div>
    );
  }
);
FilePreviewItem.displayName = 'FilePreviewItem';

// ─── Thumbnail sub-components ─────────────────────────────────────────────────

const VideoThumbnail = memo(
  ({ src, canPreview }: { src: string; canPreview: boolean }) => (
    <div className='relative size-full'>
      <video
        src={src}
        className='size-full object-cover'
        muted
        preload='metadata'
      />
      {/* Play button overlay */}
      {canPreview && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40'>
          <div className='flex size-5 items-center justify-center rounded-full bg-white/0 transition-all group-hover:bg-white/90'>
            <div className='ml-0.5 size-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-black opacity-0 transition-opacity group-hover:opacity-100' />
          </div>
        </div>
      )}
    </div>
  )
);
VideoThumbnail.displayName = 'VideoThumbnail';

const DocumentThumbnail = memo(
  ({
    file,
    ext,
    canPreview,
  }: {
    file: File;
    ext: string;
    canPreview: boolean;
  }) => {
    const Icon = getDocumentIcon(file);
    return (
      <div className='relative flex size-full flex-col items-center justify-center gap-0.5'>
        <Icon className='size-4 text-muted-foreground' />
        <span className='text-[9px] font-semibold tracking-wide text-muted-foreground'>
          {ext}
        </span>
        {canPreview && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/10'>
            <ZoomIn className='size-3.5 text-foreground opacity-0 transition-opacity group-hover:opacity-100' />
          </div>
        )}
      </div>
    );
  }
);
DocumentThumbnail.displayName = 'DocumentThumbnail';

// ─── Shared action button primitives ─────────────────────────────────────────

type PreviewActionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'destructive';
  };
const PreviewActionButton = ({
  variant = 'default',
  className,
  children,
  ...rest
}: PreviewActionButtonProps) => (
  <button
    type='button'
    className={cn(
      'flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors',
      variant === 'default' && 'hover:bg-muted hover:text-foreground',
      variant === 'destructive' &&
        'hover:bg-destructive/10 hover:text-destructive',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

type GridActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive';
};
const GridActionButton = ({
  variant = 'default',
  className,
  children,
  ...rest
}: GridActionButtonProps) => (
  <button
    type='button'
    className={cn(
      'flex size-8 items-center justify-center rounded-lg backdrop-blur-sm transition-all active:scale-95',
      'bg-white/20 text-white',
      variant === 'default' && 'hover:bg-white/35',
      variant === 'destructive' && 'hover:bg-red-500/70',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

// ─── Image Grid Item ──────────────────────────────────────────────────────────

type ImageGridItemProps = {
  uploadedFile: UploadedFile;
  onRemove: (id: string) => void;
  onPreview?: () => void;
  disabled?: boolean;
};

const ImageGridItem = memo(
  ({ uploadedFile, onRemove, onPreview, disabled }: ImageGridItemProps) => {
    const { file, preview, id } = uploadedFile;
    return (
      <div className='group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted'>
        <img
          src={preview}
          alt={file.name}
          className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
        <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
          {onPreview && (
            <GridActionButton
              aria-label={`Preview ${file.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
            >
              <ZoomIn className='size-3.5' />
            </GridActionButton>
          )}
          {!disabled && (
            <GridActionButton
              aria-label={`Remove ${file.name}`}
              variant='destructive'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
            >
              <X className='size-3.5' />
            </GridActionButton>
          )}
        </div>
        <div className='pointer-events-none absolute inset-x-0 bottom-0 px-2 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
          <p className='truncate text-[10px] font-medium text-white/90'>
            {file.name}
          </p>
        </div>
      </div>
    );
  }
);
ImageGridItem.displayName = 'ImageGridItem';

// ─── Preview List (orchestrator) ──────────────────────────────────────────────

type FilePreviewListProps = {
  files: readonly UploadedFile[];
  variant: FileUploadVariant;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

type ActivePreview = {
  uploadedFile: UploadedFile;
  siblings: readonly UploadedFile[];
  siblingIndex: number;
};

/**
 * Decides between grid (multiple images) and list (everything else) layouts.
 * Owns the MediaViewer open/close state — child items only fire callbacks.
 *
 * Preview routing:
 *  - Images  → MediaViewer with siblings for prev/next navigation
 *  - Videos  → MediaViewer without siblings (no carousel for video)
 *  - Docs    → MediaViewer without siblings
 */
export const FilePreviewList = memo(
  ({ files, variant, onRemove, disabled }: FilePreviewListProps) => {
    const [activePreview, setActivePreview] = useState<ActivePreview | null>(
      null
    );
    const closePreview = useCallback(() => setActivePreview(null), []);

    const imageFiles = files.filter((f) => isImageFile(f.file));
    const isImageVariant =
      variant === 'image' ||
      (files.length > 0 && files.every((f) => isImageFile(f.file)));

    const openPreview = useCallback(
      (f: UploadedFile) => {
        if (isImageFile(f.file)) {
          setActivePreview({
            uploadedFile: f,
            siblings: imageFiles,
            siblingIndex: imageFiles.indexOf(f),
          });
        } else {
          // Video and document — no siblings
          setActivePreview({ uploadedFile: f, siblings: [], siblingIndex: 0 });
        }
      },
      [imageFiles]
    );

    const navigateSibling = useCallback(
      (index: number) => {
        const sibling = imageFiles[index];
        if (!sibling) return;
        setActivePreview((prev) =>
          prev ? { ...prev, uploadedFile: sibling, siblingIndex: index } : null
        );
      },
      [imageFiles]
    );

    if (files.length === 0) return null;

    return (
      <>
        {isImageVariant && files.length > 1 ? (
          <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
            {files.map((f) => (
              <ImageGridItem
                key={f.id}
                uploadedFile={f}
                onRemove={onRemove}
                onPreview={() => openPreview(f)}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-1.5'>
            {files.map((f) => (
              <FilePreviewItem
                key={f.id}
                uploadedFile={f}
                variant={variant}
                onRemove={onRemove}
                onPreview={() => openPreview(f)}
                disabled={disabled}
              />
            ))}
          </div>
        )}

        {activePreview && (
          <MediaViewer
            uploadedFile={activePreview.uploadedFile}
            siblings={activePreview.siblings}
            siblingIndex={activePreview.siblingIndex}
            onClose={closePreview}
            onNavigate={
              activePreview.siblings.length > 1 ? navigateSibling : undefined
            }
          />
        )}
      </>
    );
  }
);
FilePreviewList.displayName = 'FilePreviewList';

// ─── Dropzone Placeholder ─────────────────────────────────────────────────────

type DropzonePlaceholderProps = {
  variant: FileUploadVariant;
  isDragActive: boolean;
  placeholder?: string;
  multiple: boolean;
};

export const DropzonePlaceholder = memo(
  ({
    variant,
    isDragActive,
    placeholder,
    multiple,
  }: DropzonePlaceholderProps) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-9 text-center transition-all',
        isDragActive && 'scale-[0.99]'
      )}
    >
      <div
        className={cn(
          'relative flex size-14 items-center justify-center rounded-2xl border transition-all duration-200',
          isDragActive
            ? 'border-primary/30 bg-primary/[0.08] text-primary'
            : 'border-border/70 bg-muted/60 text-muted-foreground'
        )}
      >
        <VariantIcon variant={variant} isDragActive={isDragActive} />
        {!isDragActive && (
          <div className='absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background'>
            <Upload className='size-2.5 text-muted-foreground' />
          </div>
        )}
      </div>

      <div className='space-y-1'>
        {isDragActive ? (
          <p className='text-sm font-medium text-primary'>Release to upload</p>
        ) : (
          <>
            <p className='text-sm font-medium text-foreground'>
              {placeholder ?? (
                <>
                  <span className='text-primary'>Click to upload</span> or drag
                  and drop
                </>
              )}
            </p>
            <p className='text-xs text-muted-foreground'>
              {multiple ? 'Multiple files supported' : 'Single file only'}
            </p>
          </>
        )}
      </div>
    </div>
  )
);
DropzonePlaceholder.displayName = 'DropzonePlaceholder';

// ─── Variant Icon ─────────────────────────────────────────────────────────────

function VariantIcon({
  variant,
  isDragActive,
}: {
  variant: FileUploadVariant;
  isDragActive: boolean;
}) {
  const cls = cn(
    'size-6 transition-transform duration-200',
    isDragActive && 'scale-110'
  );
  switch (variant) {
    case 'image':
      return <FileImage className={cls} />;
    case 'video':
      return <FileVideo className={cls} />;
    case 'document':
      return <FileText className={cls} />;
    case 'all':
      return <FolderOpen className={cls} />;
    default:
      return <FileText className={cls} />;
  }
}

// ─── Shared utilities ─────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function getFileTypeLabel(file: File): string {
  if (isImageFile(file)) return 'Image';
  if (isVideoFile(file)) return 'Video';
  if (isPdfFile(file)) return 'PDF';
  const ext = file.name.split('.').pop()?.toUpperCase();
  return ext ?? 'Document';
}

function getDocumentIcon(file: File) {
  const name = file.name.toLowerCase();
  if (
    name.endsWith('.xls') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.csv')
  ) {
    return FileSpreadsheet;
  }
  return FileText;
}
