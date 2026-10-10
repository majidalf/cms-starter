'use client';

import { useActionState, useEffect, useId, useRef, type ReactNode } from 'react';
import { submitContact, type ContactActionState } from '@/app/actions/contact';
import { CONTACT_LIMITS, type ContactField } from '@/lib/contact/schema';
import type { Dictionary, Locale } from '@/lib/i18n';
import { ctaArrowClass, ctaButtonClass } from '@/components/ui/CtaButton';
import { Icon } from '@/components/ui/Icon';
import { TurnstileWidget } from './TurnstileWidget';

interface Props {
  locale: Locale;
  labels: Dictionary['contactForm'];
  /** Titles of the practice areas, for the select. */
  practiceAreas: string[];
  /** Preselects a practice area, e.g. when the form sits on that area's page. */
  defaultPracticeArea?: string;
}

const INITIAL: ContactActionState = { status: 'idle' };

const LABEL = 'text-[13px] leading-[15px] text-on-navy-2';
/* The frames draw the field border in navy-700, which is 1.5:1 against the form. The States
 * board corrects it to field-border (3.6:1); that is what ships. */
const CONTROL =
  'w-full rounded-[10px] bg-transparent px-4 text-[16px] text-on-navy outline-1 -outline-offset-1 outline-field-border placeholder:text-on-navy-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-invalid:outline-2 aria-invalid:-outline-offset-2 aria-invalid:outline-error';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-center gap-2 text-[14px] leading-[20px] text-error">
      <Icon name="errorCircle" className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1">{message}</span>
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  isRequired?: boolean;
  error?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
  }) => ReactNode;
}

function Field({ id, label, isRequired = false, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL}>
        {label}
        {isRequired && <span aria-hidden="true">*</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

/**
 * Contact form (Design.pen → Home → Contact → Form; States → Form field, Primary button).
 * Errors name the field and the fix, next to an icon - never color alone. On success the
 * message replaces the form and takes focus. Sending disables the button and shows a spinner.
 */
export function ContactForm({ locale, labels, practiceAreas, defaultPracticeArea }: Props) {
  const baseId = useId();
  const [state, formAction, isPending] = useActionState(submitContact, INITIAL);
  const successRef = useRef<HTMLOutputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (state.status === 'success') successRef.current?.focus();
    if (state.status === 'error') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  if (state.status === 'success') {
    return (
      <output
        ref={successRef}
        tabIndex={-1}
        className="flex flex-col gap-[10px] rounded-control p-5 outline-1 -outline-offset-1 outline-success focus-visible:outline-2"
      >
        <p className="flex items-center gap-2 text-[16px] font-semibold leading-[19px] text-success">
          <Icon name="checkCircle" className="h-5 w-5 shrink-0" />
          {labels.successTitle}
        </p>
        <p className="text-[14px] leading-[20px] text-on-navy">{labels.successText}</p>
      </output>
    );
  }

  const error = (field: ContactField) => state.fieldErrors?.[field];
  const fieldId = (field: string) => `${baseId}-${field}`;
  const consentErrorId = `${fieldId('consent')}-error`;

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: hidden from people and assistive technology, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field id={fieldId('name')} label={labels.name} isRequired error={error('name')}>
        {(props) => (
          <input
            {...props}
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            className={`${CONTROL} h-[52px] lg:h-14`}
          />
        )}
      </Field>
      <Field id={fieldId('email')} label={labels.email} isRequired error={error('email')}>
        {(props) => (
          <input
            {...props}
            name="email"
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
            maxLength={CONTACT_LIMITS.email}
            className={`${CONTROL} h-[52px] lg:h-14`}
          />
        )}
      </Field>
      <Field id={fieldId('company')} label={labels.company} error={error('company')}>
        {(props) => (
          <input
            {...props}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company}
            className={`${CONTROL} h-[52px] lg:h-14`}
          />
        )}
      </Field>
      <Field id={fieldId('practiceArea')} label={labels.practiceArea} error={error('practiceArea')}>
        {(props) => (
          <div className="relative">
            <select
              {...props}
              name="practiceArea"
              defaultValue={defaultPracticeArea ?? ''}
              className={`${CONTROL} h-[52px] appearance-none pr-12 text-[15px] lg:h-14 [&:has(option[value='']:checked)]:text-on-navy-2`}
            >
              <option value="">{labels.practiceAreaPlaceholder}</option>
              {practiceAreas.map((area) => (
                <option key={area} value={area} className="bg-navy-900 text-on-navy">
                  {area}
                </option>
              ))}
            </select>
            <Icon
              name="caretDown"
              className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-on-navy-2"
            />
          </div>
        )}
      </Field>
      <Field id={fieldId('message')} label={labels.message} isRequired error={error('message')}>
        {(props) => (
          <textarea
            {...props}
            name="message"
            required
            maxLength={CONTACT_LIMITS.message}
            className={`${CONTROL} h-[110px] resize-y py-4 leading-[24px] lg:h-[120px]`}
          />
        )}
      </Field>
      {siteKey && <TurnstileWidget siteKey={siteKey} locale={locale} />}
      <div className="flex flex-col gap-2 py-2">
        <div className="flex gap-[10px] lg:gap-3">
          <input
            id={fieldId('consent')}
            name="consent"
            type="checkbox"
            required
            aria-invalid={error('consent') ? true : undefined}
            aria-describedby={error('consent') ? consentErrorId : undefined}
            className="consent-check mt-px h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[4px] bg-center bg-no-repeat outline-1 -outline-offset-1 outline-on-navy-2 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring aria-invalid:outline-2 aria-invalid:outline-error"
          />
          <label
            htmlFor={fieldId('consent')}
            className="flex-1 cursor-pointer text-[12px] leading-[18px] text-on-navy-2 lg:text-[13px] lg:leading-[20px]"
          >
            {labels.consent}
          </label>
        </div>
        <FieldError id={consentErrorId} message={error('consent')} />
      </div>
      {state.status === 'error' && state.message && (
        <p role="alert" className="flex items-center gap-2 text-[14px] leading-[20px] text-error">
          <Icon name="errorCircle" className="h-[18px] w-[18px] shrink-0" />
          <span className="flex-1">{state.message}</span>
        </p>
      )}
      <div className="flex lg:justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={ctaButtonClass(
            'paper',
            'w-full cursor-pointer justify-center disabled:cursor-wait lg:w-fit',
          )}
        >
          {isPending ? labels.sending : labels.submit}
          {isPending ? (
            <Icon
              name="spinner"
              className="h-[18px] w-[18px] shrink-0 animate-[spin_900ms_linear_infinite]"
            />
          ) : (
            <Icon name="arrowRight" className={ctaArrowClass} />
          )}
        </button>
      </div>
    </form>
  );
}
