import type { Metadata } from 'next';
import { defaultLocale, getDictionary, isLocale, locales } from '@/lib/i18n';
import { resolveLinks } from '@/lib/links';
import { getNavigation, getSiteSettings } from '@/lib/sanity/queries';
import { siteUrl } from '@/lib/site';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import '../globals.css';

// Root layout lives under [locale] so <html lang> follows the URL; `/` redirects to /id in
// next.config.ts. Don't add `dynamicParams = false` here: it also blocks child routes that
// weren't prerendered, so newly published pages would 404 until the next build.
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

  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()]);
  if (!settings) {
    throw new Error(
      'Site settings are not published. Publish the "Site settings" document in Studio.',
    );
  }
  const t = getDictionary(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          {t.skipToContent}
        </a>
        <SiteHeader
          locale={locale}
          settings={settings}
          links={resolveLinks(navigation?.header, locale)}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          locale={locale}
          settings={settings}
          links={resolveLinks(navigation?.footer, locale)}
        />
      </body>
    </html>
  );
}
