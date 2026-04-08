import { z } from 'zod/v3';

export const commentFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(60, { message: 'Name must not exceed 60 characters.' }),
  email: z.string().toLowerCase(),
  comment: z
    .string()
    .min(10, { message: 'Comment must be at least 10 characters.' })
    .max(1000, { message: 'Comment must not exceed 1000 characters.' }),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

/**
 * NEW: shape your API POST body derives from, keeping concerns separate.
 * The schema is the validation contract; this is the wire contract.
 */
export type CommentPayload = CommentFormValues & {
  appSlug: string;
  createdAt: string; // ISO string set on submit
};
