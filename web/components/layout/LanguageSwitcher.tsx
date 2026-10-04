'use client';

import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  label: string;
}

/**
 * Swaps the language prefix of the current URL. Slugs differ per language, so
 * /en/<indonesian-slug> is not a real page - the slug pages redirect it to the English slug
 * (lib/collectionRoutes.ts), which keeps this component free of per-page data.
 *
 * A plain <a> (full page load), not next/link, on purpose: on OpenNext the redirect above is
 * cached, and a cached redirect is replayed to client-side navigations as a 200 with a
 * Location header, which the router can't render ("This page couldn't load"). A document
 * request always gets the proper 307. A full load also swaps <html lang> and metadata cleanly.
 */
export function LanguageSwitcher({ locale, label }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex gap-1 text-sm">
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
                className={`px-2 py-1 uppercase ${isActive ? 'font-semibold text-brand' : 'text-muted hover:text-ink'}`}
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
