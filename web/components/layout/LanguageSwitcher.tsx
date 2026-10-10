'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

/** Display order of the segments, as designed: EN, then ID. */
const SEGMENT_ORDER: Locale[] = ['en', 'id'];

interface Props {
  locale: Locale;
  /** Accessible name of the control. */
  label: string;
  /** `bar`: 44×36 segments in the top bar. `menu`: 64×44 segments in the mobile menu. */
  variant?: 'bar' | 'menu';
}

const FRAME = {
  bar: 'rounded-[10px] outline-on-navy/35',
  menu: 'rounded-control outline-field-border',
} as const;

const SEGMENT = {
  bar: 'h-9 w-11 text-[14px]',
  menu: 'h-11 w-16 text-[15px]',
} as const;

/**
 * EN / ID switch (Design.pen → Top Bar → Language Switch, Mobile Menu → Segmented). The
 * selected language is a filled paper segment, not color alone.
 *
 * A plain <a> (full page load), not next/link: on OpenNext the slug redirect is cached and a
 * cached redirect replays to client-side navigations as a 200 with a Location header, which
 * the router can't render. A document request always gets the proper 307.
 */
export function LanguageSwitcher({ locale, label, variant = 'bar' }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className={`flex overflow-hidden outline-1 -outline-offset-1 ${FRAME[variant]}`}>
        {SEGMENT_ORDER.map((target) => {
          const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`);
          const isActive = target === locale;
          return (
            <li key={target}>
              <a
                href={href}
                hrefLang={target}
                lang={target}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center justify-center uppercase -outline-offset-2 ${SEGMENT[variant]} ${
                  isActive
                    ? 'bg-paper font-semibold text-ink'
                    : 'text-on-navy transition-colors hover:text-brass-light'
                }`}
              >
                {target}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
