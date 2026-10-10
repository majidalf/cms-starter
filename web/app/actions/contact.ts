'use server';

import { Resend } from 'resend';
import { defaultLocale, getDictionary, isLocale } from '@/lib/i18n';
import {
  contactSchema,
  firstErrors,
  formDataToContactInput,
  type ContactField,
} from '@/lib/contact/schema';

/** Serializable result consumed by `useActionState` in the contact form. */
export interface ContactActionState {
  status: 'idle' | 'error' | 'success';
  /** Form-level message, already in the visitor's language. */
  message?: string;
  /** Field-level messages, already in the visitor's language. */
  fieldErrors?: Partial<Record<ContactField, string>>;
}

interface TurnstileVerifyResponse {
  success: boolean;
}

/** Verifies the Turnstile token against Cloudflare's siteverify endpoint. */
async function verifyTurnstile(secret: string, token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as TurnstileVerifyResponse;
    return result.success === true;
  } catch {
    return false;
  }
}

/**
 * Validates the form, verifies the Turnstile token, and delivers the message via Resend.
 * Every failure returns a shaped state (never throws) so the form can render it. The action
 * is public by design, so it treats all input as untrusted and refuses to send unless the
 * spam check is configured and passes.
 */
export async function submitContact(
  _previous: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const requested = formData.get('locale');
  const locale = typeof requested === 'string' && isLocale(requested) ? requested : defaultLocale;
  const t = getDictionary(locale).contactForm;
  const errorText = t.errors as Record<string, string>;

  // Honeypot: a real visitor never sees or fills this field. Answer as if it worked.
  if (formData.get('website')) return { status: 'success' };

  const parsed = contactSchema.safeParse(formDataToContactInput(formData));
  if (!parsed.success) {
    const codes = firstErrors(parsed.error);
    return {
      status: 'error',
      message: t.errors.fix,
      fieldErrors: Object.fromEntries(
        Object.entries(codes).map(([field, code]) => [field, errorText[code] ?? t.errors.fix]),
      ),
    };
  }
  const { name, email, company, practiceArea, message, turnstileToken } = parsed.data;

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!turnstileSecret || !apiKey || !to || !from) {
    return { status: 'error', message: t.errors.notConfigured };
  }
  if (!(await verifyTurnstile(turnstileSecret, turnstileToken))) {
    return { status: 'error', message: t.errors.spamCheck };
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : undefined,
    practiceArea ? `Practice area: ${practiceArea}` : undefined,
    `Language: ${locale}`,
    '',
    message,
  ].filter((line): line is string => line !== undefined);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Website enquiry from ${name}`,
      replyTo: email,
      text: lines.join('\n'),
    });
    if (error) return { status: 'error', message: t.errors.failed };
  } catch {
    return { status: 'error', message: t.errors.failed };
  }

  return { status: 'success' };
}
