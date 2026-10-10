import type { Metadata } from 'next';
import { defaultLocale, getDictionary, isLocale, localePath, locales } from '@/lib/i18n';
import { organizationJsonLd } from '@/lib/jsonLd';
import { resolveLinks } from '@/lib/links';
import { routes } from '@/lib/routes';
import { getOffices } from '@/lib/sanity/collections/office';
import { localize } from '@/lib/sanity/localize';
import { getNavigation, getSiteSettings } from '@/lib/sanity/queries';
import { siteUrl } from '@/lib/site';
import { fontVariables } from '@/app/fonts';
import { CloudflareAnalytics } from '@/components/analytics/CloudflareAnalytics';
import { JsonLd } from '@/components/JsonLd';
import { GridLines } from '@/components/layout/GridLines';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteLogo } from '@/components/layout/SiteLogo';
import '../globals.css';

/** Read once when the server starts, not on every render. */
const COPYRIGHT_YEAR = new Date().getFullYear();

// Root layout lives under [locale] so <html lang> follows the URL; `/` redirects to the
// default language in next.config.ts. Don't add `dynamicParams = false` here: it also blocks
// child routes that weren't prerendered, so newly published pages would 404 until the next
// build.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.organizationName ?? '';
  return {
    metadataBase: siteUrl,
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  // An unknown first segment (e.g. /fr, or /about without a prefix) must NOT call notFound()
  // here: not-found.tsx renders inside this layout, so a 404 thrown by the layout itself
  // shows Next's bare default page. Render with the default language instead and let the
  // page below call notFound() - every page checks isLocale() - so the site's own 404 shows.
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : defaultLocale;

  const [settings, navigation, offices] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getOffices(),
  ]);
  if (!settings) {
    throw new Error(
      'Site settings are not published. Publish the "Site settings" document in Studio.',
    );
  }
  const t = getDictionary(locale);
  const organizationName = settings.organizationName ?? '';
  const homeHref = localePath(locale);
  const contactHref = localePath(locale, routes.contact);
  const officeNames = offices
    .map((office) => localize(office.name, locale))
    .filter((name): name is string => Boolean(name));
  // On every page, so the WebSite, Person and Article nodes can reference it by @id.
  const organization = organizationJsonLd({
    name: organizationName,
    legalName: settings.legalName,
    url: siteUrl.origin,
    logo: settings.logo,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    sameAs: settings.socialLinks?.map((link) => link.url),
  });
  const logo = (
    <SiteLogo logo={settings.logo} locale={locale} organizationName={organizationName} />
  );

  return (
    <html lang={locale} className={`h-full antialiased ${fontVariables}`}>
      <body className="relative flex min-h-full flex-col font-sans">
        <JsonLd data={organization} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          {t.skipToContent}
        </a>
        <GridLines />
        <SiteHeader
          locale={locale}
          homeHref={homeHref}
          contactHref={contactHref}
          organizationName={organizationName}
          logo={logo}
          positioning={localize(settings.tagline, locale)}
          email={settings.email}
          phone={settings.phone}
          offices={officeNames.join(' · ')}
          links={resolveLinks(navigation?.header, locale)}
          labels={{
            mainNav: t.mainNav,
            condensedNav: t.header.condensedNav,
            openMenu: t.openMenu,
            close: t.closeMenu,
            language: t.languageSwitcher,
            cta: t.bookConsultation,
          }}
        />
        <main id="main" className="relative flex-1">
          {children}
        </main>
        <SiteFooter
          organizationName={organizationName}
          homeHref={homeHref}
          logo={logo}
          tagline={localize(settings.footerText, locale)}
          disclaimer={localize(settings.disclaimer, locale)}
          email={settings.email}
          phone={settings.phone}
          social={(settings.socialLinks ?? []).flatMap((link) =>
            link.platform && link.url
              ? [{ key: link._key, label: link.platform, href: link.url }]
              : [],
          )}
          links={resolveLinks(navigation?.footer, locale)}
          legalLinks={resolveLinks(navigation?.legal, locale)}
          offices={offices.flatMap((office) => {
            const name = localize(office.name, locale);
            if (!name) return [];
            const kind = localize(office.kind, locale);
            return [{ key: office._id, label: kind ? `${name} · ${kind}` : name }];
          })}
          year={COPYRIGHT_YEAR}
          labels={{
            footerNav: t.footerNav,
            legalNav: t.legalNav,
            site: t.footer.site,
            contact: t.footer.contact,
            offices: t.footer.offices,
          }}
        />
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
