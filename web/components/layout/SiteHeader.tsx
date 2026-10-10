'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDictionary, localePath, type Locale } from '@/lib/i18n';
import type { ResolvedLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
  links: ResolvedLink[];
}

/**
 * Top Bar (design/Design.pen → 01 Components → Row Topbar → Top Bar,
 * Motion Notes → Top Bar: sticky, hides on scroll down, returns on scroll
 * up with a navy-950 background).
 *
 * Desktop (1400, gap 24, padding 20): logo slot 232×44 · positioning line ·
 * contact email · vertical menu (About, Partners, Practice Areas, Insights,
 * Contact) · EN/ID pill. Mobile: logo + 44px circular menu button opening a
 * full-screen navy menu.
 */
export function SiteHeader({ locale, settings, links }: Props) {
  const t = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const positioning = localize(settings.tagline, locale) || 'Advocates & Legal Consultants';

  // Lock body scroll while the mobile menu is open, close on Escape (ux: keyboard parity).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-navy-950 text-on-navy">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-6 p-5">
          <Link
            href={localePath(locale)}
            aria-label={settings.organizationName ?? undefined}
            className="flex h-11 flex-1 items-center"
          >
            {settings.logo?.asset ? (
              <SanityImage
                image={settings.logo}
                locale={locale}
                sizes="232px"
                className="h-11 w-auto max-w-[232px] object-contain"
                priority
              />
            ) : (
              <span className="font-serif text-xl text-on-navy">{settings.organizationName}</span>
            )}
          </Link>
          <p className="hidden flex-1 text-[15px] leading-snug text-on-navy lg:block">
            {positioning}
          </p>
          <div className="hidden flex-1 flex-col gap-[2px] lg:flex">
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="w-fit text-[15px] text-on-navy-2 transition-colors hover:text-brass-light"
              >
                {settings.email}
              </a>
            )}
          </div>
          {links.length > 0 && (
            <nav aria-label={t.mainNav} className="hidden w-40 shrink-0 md:block">
              <ul className="flex flex-col gap-[2px]">
                {links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-navy transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="hidden shrink-0 md:block">
            <LanguageSwitcher locale={locale} label={t.languageSwitcher} />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-navy-2/60 text-on-navy md:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </header>
      {open && (
        <dialog
          open
          aria-label="Menu"
          className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none flex-col bg-navy-950 px-4 pb-8 pt-4 text-on-navy md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl">{settings.organizationName}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-on-navy-2/60"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
          <nav aria-label={t.mainNav} className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-2">
              {links.map((link, index) => (
                <li key={link.key} className="border-t border-line-navy/60 py-[18px]">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 font-serif text-[22px] leading-[1.2] text-on-navy"
                  >
                    <span className="w-7 text-xs text-on-navy-2">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between gap-4">
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="text-[15px] text-on-navy-2">
                {settings.email}
              </a>
            )}
            <LanguageSwitcher locale={locale} label={t.languageSwitcher} />
          </div>
        </dialog>
      )}
    </>
  );
}
