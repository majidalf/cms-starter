import { z } from 'zod';

/**
 * Contact form validation (plan: Contact Form, step 1).
 * The Turnstile token is validated for presence here; authenticity is verified
 * server-side in the action via Cloudflare's siteverify endpoint.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .max(254, 'Email must be at most 254 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be at most 5000 characters'),
  turnstileToken: z.string().trim().min(1, 'Please complete the spam check'),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Field-level errors shaped for `useActionState` consumers. */
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string[]>>;

/** Extracts plain input from FormData before schema parsing. */
export function formDataToContactInput(formData: FormData): Record<string, unknown> {
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    turnstileToken: formData.get('turnstileToken'),
  };
}
