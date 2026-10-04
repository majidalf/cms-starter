import Link from 'next/link';
import { getDictionary, localePath, type Locale } from '@/lib/i18n';
import type { ResolvedLink } from '@/lib/links';
import { Container } from '@/components/ui/Container';
import { SiteLink } from '@/components/ui/SiteLink';
import { SanityImage } from '@/components/SanityImage';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
  links: ResolvedLink[];
}

export function SiteHeader({ locale, settings, links }: Props) {
  const t = getDictionary(locale);

  return (
    <header className="border-b border-ink/10">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
        <Link
          href={localePath(locale)}
          aria-label={settings.organizationName ?? undefined}
          className="flex items-center gap-3 font-serif text-xl text-brand"
        >
          {settings.logo?.asset ? (
            <SanityImage
              image={settings.logo}
              locale={locale}
              sizes="160px"
              className="h-10 w-auto"
              priority
            />
          ) : (
            settings.organizationName
          )}
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {links.length > 0 && (
            <nav aria-label={t.mainNav}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {links.map((link) => (
                  <li key={link.key}>
                    <SiteLink link={link} className="text-ink hover:text-brand" />
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <LanguageSwitcher locale={locale} label={t.languageSwitcher} />
        </div>
      </Container>
    </header>
  );
}
