'use server';

import { Resend } from 'resend';
import {
  contactSchema,
  formDataToContactInput,
  type ContactFieldErrors,
} from '@/lib/contact/schema';

/** Serializable result consumed by `useActionState` in the contact form. */
export interface ContactActionState {
  ok: boolean;
  message: string;
  fieldErrors?: ContactFieldErrors;
}

export const contactInitialState: ContactActionState = { ok: false, message: '' };

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/** Verifies the Turnstile token against Cloudflare's siteverify endpoint. */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
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
 * Validates the form, verifies the Turnstile token, and delivers the message
 * via Resend. Every failure returns a shaped state (never throws) so the form
 * can render it; the action stays unauthenticated by design (public form) and
 * treats all input as untrusted.
 */
export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse(formDataToContactInput(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please fix the highlighted fields and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { name, email, message, turnstileToken } = parsed.data;

  if (!(await verifyTurnstile(turnstileToken))) {
    return { ok: false, message: 'Spam check failed. Please try again.' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return { ok: false, message: 'The contact form is not configured. Please try again later.' };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `New contact message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) return { ok: false, message: 'Could not send your message. Please try again.' };
  } catch {
    return { ok: false, message: 'Could not send your message. Please try again.' };
  }

  return { ok: true, message: 'Thank you! Your message has been sent.' };
}
