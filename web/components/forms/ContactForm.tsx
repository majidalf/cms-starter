'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { contactInitialState, submitContact, type ContactActionState } from '@/app/actions/contact';
import type { Locale } from '@/lib/i18n';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const copy = {
  id: {
    title: 'Kirim pesan',
    name: 'Nama',
    email: 'Email',
    message: 'Pesan',
    namePlaceholder: 'Nama lengkap Anda',
    emailPlaceholder: 'nama@email.com',
    messagePlaceholder: 'Tulis pesan Anda…',
    submit: 'Kirim pesan',
    sending: 'Mengirim…',
    spamCheckUnavailable: 'Verifikasi spam belum dikonfigurasi. Coba lagi nanti.',
  },
  en: {
    title: 'Send a message',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your full name',
    emailPlaceholder: 'name@email.com',
    messagePlaceholder: 'Write your message…',
    submit: 'Send message',
    sending: 'Sending…',
    spamCheckUnavailable: 'Spam verification is not configured. Please try again later.',
  },
} as const;

interface Props {
  locale: Locale;
}

/**
 * Contact form with Cloudflare Turnstile spam protection.
 * Submits via the `submitContact` server action; the Turnstile token travels
 * as a hidden field and is verified server-side before Resend delivers the mail.
 */
export function ContactForm({ locale }: Props) {
  const t = copy[locale];
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [token, setToken] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: ContactActionState, formData: FormData) => {
      const result = await submitContact(prevState, formData);
      if (result.ok) {
        formRef.current?.reset();
        setToken('');
        if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      }
      return result;
    },
    contactInitialState,
  );

  useEffect(() => {
    if (!siteKey || !widgetRef.current || widgetIdRef.current) return;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !widgetRef.current || widgetIdRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        callback: (nextToken: string) => setToken(nextToken),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      if (window.turnstile) renderWidget();
      else existing.addEventListener('load', renderWidget, { once: true });
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderWidget, { once: true });
    document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  const fieldErrors = state.fieldErrors;
  const inputClass =
    'w-full rounded-md border border-field-border bg-navy-950 px-3 py-2.5 text-on-navy placeholder:text-on-navy-2/60 focus:border-brass-light focus:outline-2 focus:outline-focus-ring';

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5 rounded-panel border border-on-navy/15 bg-navy-900 p-6 md:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-on-navy">
          {t.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder={t.namePlaceholder}
          aria-invalid={fieldErrors?.name ? true : undefined}
          aria-describedby={fieldErrors?.name ? 'contact-name-error' : undefined}
          className={inputClass}
        />
        {fieldErrors?.name && (
          <p id="contact-name-error" role="alert" className="text-sm text-error">
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium text-on-navy">
          {t.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder={t.emailPlaceholder}
          aria-invalid={fieldErrors?.email ? true : undefined}
          aria-describedby={fieldErrors?.email ? 'contact-email-error' : undefined}
          className={inputClass}
        />
        {fieldErrors?.email && (
          <p id="contact-email-error" role="alert" className="text-sm text-error">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-on-navy">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={fieldErrors?.message ? true : undefined}
          aria-describedby={fieldErrors?.message ? 'contact-message-error' : undefined}
          className={inputClass}
        />
        {fieldErrors?.message && (
          <p id="contact-message-error" role="alert" className="text-sm text-error">
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      {siteKey ? (
        <>
          <div ref={widgetRef} />
          <input type="hidden" name="turnstileToken" value={token} />
          {fieldErrors?.turnstileToken && (
            <p role="alert" className="text-sm text-error">
              {fieldErrors.turnstileToken[0]}
            </p>
          )}
        </>
      ) : (
        <p role="alert" className="text-sm text-error">
          {t.spamCheckUnavailable}
        </p>
      )}

      <div aria-live="polite">
        {state.message && (
          <p className={`text-sm ${state.ok ? 'text-success' : 'text-error'}`}>{state.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={pending || !siteKey || !token}
          className="inline-flex items-center gap-3 rounded-xs bg-paper px-6 py-4 text-base font-medium text-navy-900 transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
