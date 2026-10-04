'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  label: string;
}

/**
 * Swaps the language prefix of the current URL. Slugs differ per language, so
 * /en/<indonesian-slug> is not a real page - the [slug] route redirects it to the English
 * slug (see PAGE_BY_ANY_SLUG_QUERY), which keeps this component free of per-page data.
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
              <Link
                href={href}
                hrefLang={target}
                lang={target}
                aria-current={isActive ? 'true' : undefined}
                className={`px-2 py-1 uppercase ${isActive ? 'font-semibold text-brand' : 'text-muted hover:text-ink'}`}
              >
                {target}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
