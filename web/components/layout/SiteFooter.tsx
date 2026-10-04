import { getDictionary, type Locale } from '@/lib/i18n';
import { telHref, type ResolvedLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { SiteLink } from '@/components/ui/SiteLink';
import type { OFFICES_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
  links: ResolvedLink[];
  offices: OFFICES_QUERY_RESULT;
}

export function SiteFooter({ locale, settings, links, offices }: Props) {
  const t = getDictionary(locale);
  const footerText = localize(settings.footerText, locale);
  const disclaimer = localize(settings.disclaimer, locale);
  // Server-only render (no hydration mismatch possible). Kept out of module scope because
  // module-level time isn't reliable on Cloudflare Workers.
  // oxlint-disable-next-line react/purity
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink/10 py-10 text-sm text-muted">
      <Container className="flex flex-col gap-6">
        {links.length > 0 && (
          <nav aria-label={t.footerNav}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.key}>
                  <SiteLink link={link} className="hover:text-ink" />
                </li>
              ))}
            </ul>
          </nav>
        )}
        {offices.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <li key={office._id} className="flex flex-col gap-1">
                <span className="font-medium text-ink">{localize(office.name, locale)}</span>
                {office.address?.city && <span>{office.address.city}</span>}
                {office.phone && (
                  <a href={telHref(office.phone)} className="hover:text-ink">
                    {office.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        {footerText && <p className="max-w-2xl">{footerText}</p>}
        {disclaimer && <p className="max-w-3xl text-xs">{disclaimer}</p>}
        <p>
          © {year} {settings.legalName ?? settings.organizationName}. {t.allRightsReserved}
        </p>
      </Container>
    </footer>
  );
}
