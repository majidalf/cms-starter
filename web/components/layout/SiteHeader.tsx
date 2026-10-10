'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import type { ResolvedLink } from '@/lib/links';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu, type MobileMenuLabels } from './MobileMenu';
import { useHeaderState } from './useHeaderState';

export interface SiteHeaderLabels extends MobileMenuLabels {
  openMenu: string;
  condensedNav: string;
}

interface Props {
  locale: Locale;
  homeHref: string;
  contactHref: string;
  organizationName: string;
  /** The logo image, rendered on the server (232×44 slot). */
  logo: ReactNode;
  /** "Advocates & Legal Consultants" */
  positioning?: string;
  email?: string | null;
  phone?: string | null;
  offices?: string;
  links: ResolvedLink[];
  labels: SiteHeaderLabels;
}

/** Hidden parts leave the tab order and the accessibility tree, and move up 8px as they fade. */
const HIDDEN = 'pointer-events-none -translate-y-2 opacity-0';
const FADE = 'transition-[opacity,transform] duration-200';
const CURRENT = 'text-brass-light underline decoration-2 underline-offset-4';

/**
 * Top Bar (Design.pen → 01 Components → Top Bar, Header · Scroll states).
 *
 * Expanded - at the top of the page or scrolling up: logo, positioning line, email, the
 * vertical menu and the language switch. Condensed - scrolling down past 80px: only the
 * navigation, as one horizontal strip pinned to the far right (mobile: the menu button).
 * Focus inside the header always brings the whole header back.
 *
 * The menu rows are 24px apart, not the frame's 18px: WCAG 2.2 (2.5.8) needs 24px between
 * pointer targets, and the design's own build notes ask for it.
 */
export function SiteHeader({
  locale,
  homeHref,
  contactHref,
  organizationName,
  logo,
  positioning,
  email,
  phone,
  offices,
  links,
  labels,
}: Props) {
  const pathname = usePathname();
  const { isCondensed: scrolledDown, isAtTop } = useHeaderState();
  const [hasFocus, setHasFocus] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isCondensed = scrolledDown && !hasFocus;
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const logoLink = (
    <Link
      href={homeHref}
      aria-label={organizationName}
      className="flex h-11 w-[232px] items-center"
    >
      {logo}
    </Link>
  );

  return (
    <>
      <header
        onFocus={() => setHasFocus(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
        }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
          isAtTop || isCondensed ? 'bg-transparent' : 'bg-navy-950'
        } ${isCondensed ? 'pointer-events-none' : ''}`}
      >
        <div className="relative mx-auto w-full max-w-[1440px] lg:px-5">
          {/* Expanded bar */}
          <div
            inert={isCondensed}
            className={`flex items-center justify-between p-4 lg:items-start lg:justify-start lg:gap-6 lg:px-5 lg:pb-0 lg:pt-5 ${FADE} ${
              isCondensed ? HIDDEN : ''
            }`}
          >
            <div className="lg:flex-1">{logoLink}</div>
            {positioning && (
              <p className="hidden flex-1 text-[15px] leading-[18px] text-on-navy lg:block">
                {positioning}
              </p>
            )}
            <div className="hidden flex-1 flex-col gap-[2px] lg:flex">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="w-fit text-[15px] leading-[18px] text-on-navy-2 transition-colors hover:text-brass-light"
                >
                  {email}
                </a>
              )}
            </div>
            <nav aria-label={labels.mainNav} className="hidden w-40 shrink-0 lg:block">
              <ul className="-mt-1 flex flex-col items-start">
                {links.map((link) => (
                  <li key={link.key} className="flex">
                    <Link
                      href={link.href}
                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                      className={`text-[14px] leading-6 transition-colors hover:text-brass-light ${
                        isCurrent(link.href) ? CURRENT : 'text-on-navy'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="hidden shrink-0 lg:block">
              <LanguageSwitcher locale={locale} label={labels.language} />
            </div>
          </div>

          {/* Condensed: the navigation as one strip, far right (desktop) */}
          <nav
            aria-label={labels.condensedNav}
            inert={!isCondensed}
            className={`pointer-events-auto absolute right-5 top-5 hidden rounded-[12px] bg-navy-900/90 px-6 py-[14px] outline-1 -outline-offset-1 outline-on-navy/20 backdrop-blur-[7px] lg:block ${FADE} ${
              isCondensed ? '' : HIDDEN
            }`}
          >
            <ul className="flex items-center gap-7">
              {links.map((link) => (
                <li key={link.key} className="flex">
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? 'page' : undefined}
                    className={`pb-[3px] text-[15px] leading-[18px] transition-colors hover:text-brass-light ${
                      isCurrent(link.href) ? CURRENT : 'text-on-navy'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* The menu button stays in both states (mobile) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label={labels.openMenu}
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            className={`pointer-events-auto absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-on-navy outline-1 -outline-offset-1 outline-on-navy-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring lg:hidden ${
              isCondensed ? 'bg-navy-900/90' : 'bg-navy-950/70'
            }`}
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
        </div>
      </header>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        locale={locale}
        logo={<div className="flex h-11 w-[232px] items-center">{logo}</div>}
        links={links}
        currentPath={pathname}
        contactHref={contactHref}
        email={email}
        phone={phone}
        offices={offices}
        labels={labels}
      />
    </>
  );
}
