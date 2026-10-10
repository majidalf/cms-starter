import { z } from 'zod';

/*
 * Contact form validation, shared by the form and the server action. Messages are error
 * codes, not sentences: the action turns them into text in the visitor's language
 * (dictionary → contactForm.errors).
 */

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  practiceArea: 150,
  message: 5000,
  messageMin: 10,
} as const;

/** Control characters have no place in a name or subject line (header injection). */
const SINGLE_LINE = /^\P{Cc}*$/u;

const optionalLine = (max: number) =>
  z.string().trim().max(max, 'tooLong').regex(SINGLE_LINE, 'tooLong').optional().default('');

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'name')
    .max(CONTACT_LIMITS.name, 'tooLong')
    .regex(SINGLE_LINE, 'name'),
  // Trim first: z.email() alone validates before trimming and rejects padded input.
  email: z.string().trim().max(CONTACT_LIMITS.email, 'tooLong').pipe(z.email('email')),
  company: optionalLine(CONTACT_LIMITS.company),
  practiceArea: optionalLine(CONTACT_LIMITS.practiceArea),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, 'message')
    .max(CONTACT_LIMITS.message, 'tooLong'),
  consent: z.literal('on', 'consent'),
  turnstileToken: z.string().trim().max(4096, 'spamCheck').optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactInput;

/** One error code per field: the first problem found. */
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

function text(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/** Extracts plain input from FormData before schema parsing. */
export function formDataToContactInput(formData: FormData): Record<string, unknown> {
  return {
    name: text(formData.get('name')),
    email: text(formData.get('email')),
    company: text(formData.get('company')),
    practiceArea: text(formData.get('practiceArea')),
    message: text(formData.get('message')),
    consent: text(formData.get('consent')),
    turnstileToken: text(formData.get('turnstileToken')),
  };
}

export function firstErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !(field in errors)) errors[field] = issue.message;
  }
  return errors;
}
