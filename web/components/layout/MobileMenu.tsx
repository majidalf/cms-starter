'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import type { ResolvedLink } from '@/lib/links';
import { ctaArrowClass, ctaButtonClass } from '@/components/ui/CtaButton';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface MobileMenuLabels {
  close: string;
  mainNav: string;
  language: string;
  cta: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  logo: ReactNode;
  links: ResolvedLink[];
  currentPath: string;
  contactHref: string;
  email?: string | null;
  phone?: string | null;
  /** "Jakarta · Denpasar" */
  offices?: string;
  labels: MobileMenuLabels;
}

/**
 * Mobile Menu · Open 375 (Design.pen). A modal <dialog>: focus moves to the close button,
 * Escape closes it, focus returns to the menu button, and the page behind does not scroll.
 * Links are 64px tall; the language segments and the close button are 44px.
 */
export function MobileMenu({
  isOpen,
  onClose,
  locale,
  logo,
  links,
  currentPath,
  contactHref,
  email,
  phone,
  offices,
  labels,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={labels.mainNav}
      className="m-0 h-dvh max-h-none w-screen max-w-none flex-col overflow-y-auto bg-navy-950 text-on-navy backdrop:bg-navy-950 open:flex lg:hidden"
    >
      <div className="flex items-center justify-between p-4">
        {logo}
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-8 px-4 pb-7 pt-4">
        <nav aria-label={labels.mainNav}>
          <ul className="flex flex-col border-t border-line-navy">
            {links.map((link) => {
              const isCurrent = currentPath.startsWith(link.href);
              return (
                <li key={link.key} className="border-b border-line-navy">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={isCurrent ? 'page' : undefined}
                    className="flex h-[63px] items-center -outline-offset-2"
                  >
                    <span
                      className={`border-b-2 pb-1 font-display text-[34px] leading-[37px] tracking-[-0.3px] ${
                        isCurrent
                          ? 'border-brass-light text-brass-light'
                          : 'border-transparent text-on-navy'
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-on-navy-2">{labels.language}</span>
            <LanguageSwitcher locale={locale} label={labels.language} variant="menu" />
          </div>
          <Link
            href={contactHref}
            onClick={onClose}
            className={ctaButtonClass('paper', 'justify-center')}
          >
            {labels.cta}
            <Icon name="arrowRight" className={ctaArrowClass} />
          </Link>
          <div className="flex flex-col gap-[6px] border-t border-line-navy pt-4">
            {email && (
              <a href={`mailto:${email}`} className="w-fit text-[15px] text-on-navy">
                {email}
              </a>
            )}
            {phone && <span className="text-[15px] text-on-navy">{phone}</span>}
            {offices && <span className="text-[14px] text-on-navy-2">{offices}</span>}
          </div>
        </div>
      </div>
    </dialog>
  );
}
