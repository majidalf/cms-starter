import type { Metadata } from 'next';
import { defaultLocale, locales, ogLocale, type Locale } from '@/lib/i18n';
import { urlForImage, type SanityImageRef } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/** Only the production dataset may be indexed - staging content must never reach Google. */
const isIndexable = process.env.NEXT_PUBLIC_SANITY_DATASET === 'production';

export interface SeoValue {
  metaTitle?: Partial<Record<Locale, string | null>> | null;
  metaDescription?: Partial<Record<Locale, string | null>> | null;
  ogImage?: SanityImageRef | null;
  noIndex?: boolean | null;
  canonicalUrl?: Partial<Record<Locale, string | null>> | null;
}

interface BuildMetadataInput {
  locale: Locale;
  /** The document's own title, used when seo.metaTitle is empty. */
  title?: string;
  /** The document's own summary/excerpt, used when seo.metaDescription is empty. */
  description?: string;
  seo?: SeoValue | null;
  /** siteSettings.defaultSeo */
  defaults?: SeoValue | null;
  /** Path of this same content in every language (no host), e.g. {id: '/id/tentang', en: '/en/about'}.
   * A language without a path is left out of hreflang. */
  paths: Partial<Record<Locale, string>>;
}

export function buildMetadata({
  locale,
  title,
  description: ownDescription,
  seo,
  defaults,
  paths,
}: BuildMetadataInput): Metadata {
  const metaTitle = localize(seo?.metaTitle, locale) ?? title;
  const description =
    localize(seo?.metaDescription, locale) ??
    ownDescription ??
    localize(defaults?.metaDescription, locale);
  const ogImageSource = seo?.ogImage ?? defaults?.ogImage;
  const ogImage = ogImageSource?.asset
    ? urlForImage(ogImageSource).width(OG_IMAGE_WIDTH).height(OG_IMAGE_HEIGHT).fit('crop').url()
    : undefined;

  const languages: Record<string, string> = {};
  for (const lang of locales) {
    const path = paths[lang];
    if (path) languages[lang] = path;
  }
  if (paths[defaultLocale]) languages['x-default'] = paths[defaultLocale];

  return {
    // Left out when empty so the layout's default title/description still apply.
    ...(metaTitle ? { title: metaTitle } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: localize(seo?.canonicalUrl, locale) ?? paths[locale],
      languages,
    },
    robots: !isIndexable || seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: metaTitle,
      description,
      locale: ogLocale[locale],
      url: paths[locale],
      images: ogImage
        ? [{ url: ogImage, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }]
        : undefined,
    },
  };
}
