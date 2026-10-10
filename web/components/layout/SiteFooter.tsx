import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ResolvedLink } from '@/lib/links';
import { telHref } from '@/lib/links';

export interface FooterOffice {
  key: string;
  /** "Jakarta · Main office" */
  label: string;
}

export interface SiteFooterLabels {
  footerNav: string;
  legalNav: string;
  site: string;
  contact: string;
  offices: string;
}

interface Props {
  organizationName: string;
  homeHref: string;
  /** The logo image, rendered on the server. */
  logo: ReactNode;
  tagline?: string;
  disclaimer?: string;
  email?: string | null;
  phone?: string | null;
  social: { key: string; label: string; href: string }[];
  links: ResolvedLink[];
  legalLinks: ResolvedLink[];
  offices: FooterOffice[];
  year: number;
  labels: SiteFooterLabels;
}

const HEADING = 'text-[13px] leading-[15px] text-on-navy-2';
const ITEM =
  'w-fit text-[15px] leading-[18px] text-on-navy transition-colors hover:text-brass-light';
const SMALL = 'text-[12px] leading-[18px] text-on-navy-2 lg:text-[13px] lg:leading-[15px]';

function FooterLink({ link, className }: { link: ResolvedLink; className: string }) {
  if (link.isExternal) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

/**
 * Footer (Design.pen → Home · Desktop 1440 → Footer, Home · Mobile 375 → Footer).
 * Desktop: brand column, then Site / Contact / Offices at 260px each, and a ruled bottom
 * row with the disclaimer and the legal links. Mobile: logo, one link list, disclaimer,
 * legal line. Side padding follows the page: 40px on the home page, 20px elsewhere.
 */
export function SiteFooter({
  organizationName,
  homeHref,
  logo,
  tagline,
  disclaimer,
  email,
  phone,
  social,
  links,
  legalLinks,
  offices,
  year,
  labels,
}: Props) {
  return (
    <footer className="site-footer relative mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 pb-7 pt-14 lg:gap-16 lg:px-5 lg:pb-8 lg:pt-[100px]">
      <div className="flex flex-col gap-7 lg:flex-row lg:gap-10">
        <div className="flex flex-col gap-5 lg:flex-1">
          <Link
            href={homeHref}
            aria-label={organizationName}
            className="flex h-11 w-[232px] items-center lg:h-[68px] lg:w-[360px]"
          >
            {logo}
          </Link>
          {tagline && (
            <p className="hidden text-[15px] leading-[18px] text-on-navy-2 lg:block">{tagline}</p>
          )}
        </div>
        <nav
          aria-label={labels.footerNav}
          className="flex flex-col gap-2 lg:w-[260px] lg:gap-[10px]"
        >
          <p className={`hidden lg:block ${HEADING}`}>{labels.site}</p>
          <ul className="flex flex-col gap-2 lg:gap-[10px]">
            {links.map((link) => (
              <li key={link.key} className="flex">
                <FooterLink link={link} className={ITEM} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden w-[260px] flex-col gap-[10px] lg:flex">
          <p className={HEADING}>{labels.contact}</p>
          {email && (
            <a href={`mailto:${email}`} className={ITEM}>
              {email}
            </a>
          )}
          {phone && (
            <a href={telHref(phone)} className={ITEM}>
              {phone}
            </a>
          )}
          {social.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={ITEM}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden w-[260px] flex-col gap-[10px] lg:flex">
          <p className={HEADING}>{labels.offices}</p>
          {offices.map((office) => (
            <p key={office.key} className="text-[15px] leading-[18px] text-on-navy">
              {office.label}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-7 lg:flex-row lg:justify-between lg:gap-10 lg:border-t lg:border-line-navy lg:pt-6">
        {disclaimer && (
          <p className="text-[12px] leading-[18px] text-on-navy-2 lg:max-w-[640px] lg:text-[13px] lg:leading-[20px]">
            {disclaimer}
          </p>
        )}
        <nav aria-label={labels.legalNav}>
          <ul className="flex flex-wrap items-center gap-x-[6px] gap-y-1 lg:gap-x-6">
            {legalLinks.map((link) => (
              <li key={link.key} className="flex items-center gap-x-[6px]">
                <FooterLink
                  link={link}
                  className={`${SMALL} transition-colors hover:text-brass-light`}
                />
                <span aria-hidden="true" className={`${SMALL} lg:hidden`}>
                  ·
                </span>
              </li>
            ))}
            <li className={SMALL}>
              © {year} {organizationName}
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
