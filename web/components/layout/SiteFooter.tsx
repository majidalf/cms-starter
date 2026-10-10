import { getDictionary, type Locale } from '@/lib/i18n';
import { telHref, type ResolvedLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';
import { SiteLink } from '@/components/ui/SiteLink';
import type { OFFICES_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/sanity.types';

interface Props {
  locale: Locale;
  settings: NonNullable<SITE_SETTINGS_QUERY_RESULT>;
  links: ResolvedLink[];
  offices: OFFICES_QUERY_RESULT;
}

/**
 * Footer (design/Design.pen → Home · Desktop 1440 → Footer).
 * Navy-950, padding 100/40/32/40, gap 64. Top row (gap 40): brand column
 * (logo M 360×68 + tagline 15px) + three 260px columns (Site 15px links,
 * Contact, Offices). Bottom row: top rule, disclaimer 13px/1.5 (max 640)
 * + legal row 13px. Rendered once by the locale layout.
 */
export function SiteFooter({ locale, settings, links, offices }: Props) {
  const t = getDictionary(locale);
  const tagline = localize(settings.footerText, locale) || t.footerTagline;
  const disclaimer = localize(settings.disclaimer, locale);
  const linkedIn = settings.socialLinks?.find((link) =>
    link.url?.toLowerCase().includes('linkedin'),
  );
  // Server-only render (no hydration mismatch possible). Kept out of module scope because
  // module-level time isn't reliable on Cloudflare Workers.
  // oxlint-disable-next-line react/purity
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-on-navy-2">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 pt-[100px] pb-8 md:gap-16 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            {settings.logo?.asset ? (
              <SanityImage
                image={settings.logo}
                locale={locale}
                sizes="360px"
                className="h-auto w-full max-w-[360px] object-contain"
              />
            ) : (
              <p className="font-display text-2xl text-on-navy">{settings.organizationName}</p>
            )}
            <p className="max-w-md text-[15px] leading-relaxed">{tagline}</p>
          </div>
          {links.length > 0 && (
            <nav
              aria-label={t.footerNav}
              className="flex w-full shrink-0 flex-col gap-[10px] md:w-[260px]"
            >
              <p className="text-[13px]">{t.footerSite}</p>
              <ul className="flex flex-col gap-[10px]">
                {links.map((link) => (
                  <li key={link.key}>
                    <SiteLink
                      link={link}
                      className="text-[15px] text-on-navy transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="flex w-full shrink-0 flex-col gap-[10px] md:w-[260px]">
            <p className="text-[13px]">{t.footerContact}</p>
            <ul className="flex flex-col gap-[10px] text-[15px] text-on-navy">
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a
                    href={telHref(settings.phone)}
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {linkedIn?.url && (
                <li>
                  <a
                    href={linkedIn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
          {offices.length > 0 && (
            <div className="flex w-full shrink-0 flex-col gap-[10px] md:w-[260px]">
              <p className="text-[13px]">{t.footerOffices}</p>
              <ul className="flex flex-col gap-[10px] text-[15px] text-on-navy">
                {offices.map((office) => {
                  const name = localize(office.name, locale);
                  if (!name) return null;
                  return <li key={office._id}>{name}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 border-t border-line-navy pt-6 md:flex-row md:items-start md:justify-between md:gap-10">
          {disclaimer ? (
            <p className="w-full max-w-[640px] text-[13px] leading-[1.5]">{disclaimer}</p>
          ) : (
            <p className="w-full max-w-[640px] text-[13px] leading-[1.5]">{t.article.disclaimer}</p>
          )}
          <p className="flex shrink-0 gap-6 text-[13px]">
            <span>
              © {year} {settings.legalName ?? settings.organizationName}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
