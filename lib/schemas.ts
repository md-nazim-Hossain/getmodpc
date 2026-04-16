import { z } from 'zod/v3';

export const commentFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(60, { message: 'Name must not exceed 60 characters.' }),
  email: z.string().toLowerCase(),
  content: z.string(),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

/**
 * NEW: shape your API POST body derives from, keeping concerns separate.
 * The schema is the validation contract; this is the wire contract.
 */
export type CommentPayload = CommentFormValues & {
  app_id: string;
};

export const REPORT_REASONS = [
  'Not Working',
  'Broken Link',
  'Wrong Information',
  'Virus / Malware',
  'Duplicate App',
  'Other',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const reportAppSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  reason: z.enum(REPORT_REASONS, {
    required_error: 'Please select a reason',
    invalid_type_error: 'Please select a valid reason',
  }),

  details: z
    .string()
    .max(500, 'Details must be 500 characters or fewer')
    .optional(),
});

export type ReportAppFormValues = z.infer<typeof reportAppSchema>;
