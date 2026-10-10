'use client';

import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  label: string;
}

/**
 * EN / ID pill (design/Design.pen → 01 Components → Row Topbar →
 * Language Switch). Active language is a paper chip, 44×36; the frame is a
 * 10px rounded outline. A plain <a> (full page load), not next/link: on
 * OpenNext the slug redirect is cached and a cached redirect replays to
 * client-side navigations as a 200 with a Location header, which the router
 * can't render. A document request always gets the proper 307.
 */
export function LanguageSwitcher({ locale, label }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex overflow-hidden rounded-[10px] border border-on-navy/35">
        {locales.map((target) => {
          const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`);
          const isActive = target === locale;
          return (
            <li key={target}>
              <a
                href={href}
                hrefLang={target}
                lang={target}
                aria-current={isActive ? 'true' : undefined}
                className={`flex h-9 w-11 items-center justify-center text-sm uppercase ${
                  isActive
                    ? 'bg-paper font-semibold text-navy-900'
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
