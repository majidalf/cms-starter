// Keep `locales` in sync with studio/lib/locales.ts - web/ and studio/ are separate npm
// projects, so the list is duplicated on purpose instead of shared through a package.
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Open Graph wants language_TERRITORY. */
export const ogLocale: Record<Locale, string> = { id: 'id_ID', en: 'en_US' };

/** `/id`, `/id/about`, ... - `path` is the part after the language prefix. */
export function localePath(locale: Locale, path = ''): string {
  return `/${locale}${path}`;
}

/** The same content's path in every language, e.g. for hreflang. `build` returns undefined
 * for a language the content has no URL in. */
export function pathsForAllLocales(
  build: (locale: Locale) => string | undefined,
): Partial<Record<Locale, string>> {
  return Object.fromEntries(locales.map((locale) => [locale, build(locale)]));
}

/** Fixed UI text. Anything an editor should be able to change belongs in Sanity instead. */
const dictionaries = {
  id: {
    skipToContent: 'Langsung ke konten',
    mainNav: 'Navigasi utama',
    footerNav: 'Navigasi footer',
    languageSwitcher: 'Pilih bahasa',
    switchTo: 'Baca dalam Bahasa Inggris',
    allRightsReserved: 'Hak cipta dilindungi.',
    notFoundTitle: 'Halaman tidak ditemukan',
    notFoundBody: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
    backHome: 'Kembali ke beranda',
  },
  en: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    languageSwitcher: 'Choose language',
    switchTo: 'Read in Indonesian',
    allRightsReserved: 'All rights reserved.',
    notFoundTitle: 'Page not found',
    notFoundBody: 'The page you are looking for does not exist or has moved.',
    backHome: 'Back to home',
  },
} satisfies Record<Locale, Record<string, string>>;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
