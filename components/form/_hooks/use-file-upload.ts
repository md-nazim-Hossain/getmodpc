import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import type { StoreAs, UploadedFile } from '../_config/file-upload-types';

// ─── Types ─────────────────────────────────────────────────────────────────────

type UseFileUploadOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  multiple: boolean;
  field: ControllerRenderProps<TFieldValues, TName>;
  storeAs: StoreAs;
  onFilesChange?: (files: File | File[] | null) => void;
};

type UseFileUploadReturn = {
  uploadedFiles: readonly UploadedFile[];
  addFiles: (accepted: File[]) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function makeUploadedFile(file: File): UploadedFile {
  return {
    file,
    preview: URL.createObjectURL(file),
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
}

/**
 * Reads a single File as a base64 data URL string via FileReader.
 * Matches the pattern: reader.readAsDataURL(file) → reader.result as string
 */
function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages local file state for a react-hook-form controller field.
 *
 * Responsibilities:
 *  - Creates/revokes object URLs (no memory leaks)
 *  - Syncs to RHF field on every mutation in the format determined by `storeAs`
 *  - Fires optional external `onFilesChange` side-effect
 *
 * Value stored in RHF:
 *  - storeAs='file'   → File | File[] | null        (synchronous, default)
 *  - storeAs='base64' → string | string[] | null     (async via FileReader)
 *
 * NOT responsible for:
 *  - Validation (react-dropzone + RHF handle that)
 *  - Upload to server (callers compose this hook with their upload logic)
 */
export function useFileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  multiple,
  field,
  storeAs,
  onFilesChange,
}: UseFileUploadOptions<TFieldValues, TName>): UseFileUploadReturn {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Track every live object URL so we can revoke them all on unmount.
  // Using a ref (not state) to avoid triggering re-renders.
  const liveUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = liveUrlsRef.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  // ── Internal helpers ────────────────────────────────────────────────────────

  const create = useCallback((file: File): UploadedFile => {
    const entry = makeUploadedFile(file);
    liveUrlsRef.current.add(entry.preview);
    return entry;
  }, []);

  const revoke = useCallback((entry: UploadedFile) => {
    URL.revokeObjectURL(entry.preview);
    liveUrlsRef.current.delete(entry.preview);
  }, []);

  /**
   * Resolves the correct RHF value from a list of UploadedFile entries and
   * calls field.onChange + onFilesChange.
   *
   * 'file'   — synchronous. Immediately commits File | File[] | null.
   * 'base64' — asynchronous. Reads all files with FileReader in parallel via
   *            Promise.all, then commits string | string[] | null once all
   *            reads complete (typically <5 ms for small files).
   *            The local preview (object URL) is shown instantly; the RHF
   *            value update follows once the reads resolve.
   */
  const commit = useCallback(
    async (next: UploadedFile[]) => {
      if (storeAs === 'base64') {
        const base64s = await Promise.all(
          next.map((u) => readAsBase64(u.file))
        );
        const value = multiple ? base64s : (base64s[0] ?? null);
        field.onChange(value);
        onFilesChange?.(value as any);
      } else {
        const raw = next.map((u) => u.file);
        const value: File | File[] | null = multiple ? raw : (raw[0] ?? null);
        field.onChange(value);
        onFilesChange?.(value);
      }
    },
    [storeAs, multiple, field, onFilesChange]
  );

  // ── Public API ──────────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (accepted: File[]) => {
      if (accepted.length === 0) return;

      setUploadedFiles((prev) => {
        let next: UploadedFile[];

        if (multiple) {
          next = [...prev, ...accepted.map(create)];
        } else {
          // Revoke previous entry before replacing
          prev.forEach(revoke);
          next = [create(accepted[0]!)];
        }

        // commit is async for base64 but we don't await here intentionally:
        // the local preview state update is synchronous and immediate,
        // the RHF value follows once FileReader resolves (~1–5 ms).
        void commit(next);
        return next;
      });
    },
    [multiple, create, revoke, commit]
  );

  const removeFile = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => {
        const target = prev.find((f) => f.id === id);
        if (target) revoke(target);

        const next = prev.filter((f) => f.id !== id);
        void commit(next);
        return next;
      });
    },
    [revoke, commit]
  );

  const clearAll = useCallback(() => {
    setUploadedFiles((prev) => {
      prev.forEach(revoke);
      return [];
    });
    const empty: File | File[] | null = multiple ? [] : null;
    field.onChange(empty);
    onFilesChange?.(empty);
  }, [multiple, field, onFilesChange, revoke]);

  return { uploadedFiles, addFiles, removeFile, clearAll };
}
