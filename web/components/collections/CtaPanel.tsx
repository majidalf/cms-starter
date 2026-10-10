import Link from 'next/link';
import { telHref } from '@/lib/links';
import { Container } from '@/components/ui/Container';

interface Props {
  title: string;
  lead: string;
  email?: string | null;
  phone?: string | null;
  contactHref: string;
  contactLabel: string;
}

/**
 * Closing CTA on detail pages (practice area, partner profile, about):
 * the Design.pen CTA Panel - navy-800, display heading, lead, a direct
 * contact line and a paper button to the contact page.
 */
export function CtaPanel({ title, lead, email, phone, contactHref, contactLabel }: Props) {
  const direct = [phone, email].filter(Boolean).join(' · ');
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-8 rounded-panel bg-navy-800 p-8 text-on-navy md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-balance md:text-4xl">
              {title}
            </h2>
            <p className="leading-relaxed text-on-navy-2">{lead}</p>
            {direct && (
              <p className="text-on-navy">
                {phone && (
                  <a
                    href={telHref(phone)}
                    className="underline underline-offset-4 hover:text-brass-light"
                  >
                    {phone}
                  </a>
                )}
                {phone && email && ' · '}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="underline underline-offset-4 hover:text-brass-light"
                  >
                    {email}
                  </a>
                )}
              </p>
            )}
          </div>
          <Link
            href={contactHref}
            className="inline-flex w-fit items-center gap-3 rounded-xs bg-paper px-6 py-4 text-base font-medium text-navy-900 transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
          >
            {contactLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
