import { en, type Dictionary } from './dictionaries/en';
import { id } from './dictionaries/id';

export type { Dictionary };

// Keep `locales` in sync with studio/lib/locales.ts - web/ and studio/ are separate npm
// projects, so the list is duplicated on purpose instead of shared through a package.
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
// English first for this client (decision D-14): the design and its copy are English.
export const defaultLocale: Locale = 'en';

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

/** Locale for Intl date/number formatting. */
const intlLocale: Record<Locale, string> = { id: 'id-ID', en: 'en-GB' };

/** Formats a Sanity `date` value ("2026-03-12"). Read as UTC so the day never shifts with
 * the server's time zone. */
export function formatDate(date: string | null | undefined, locale: Locale): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(
    parsed,
  );
}

const shortMonthLocale: Record<Locale, string> = { id: 'id-ID', en: 'en-US' };

/** "12 Sep 2026": the compact date used in article and matter lists. */
export function formatShortDate(
  date: string | null | undefined,
  locale: Locale,
): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  // Composed by hand: en-GB abbreviates September as "Sept", the design uses "Sep".
  const month = new Intl.DateTimeFormat(shortMonthLocale[locale], {
    month: 'short',
    timeZone: 'UTC',
  }).format(parsed);
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${day} ${month} ${parsed.getUTCFullYear()}`;
}

/** "en" -> "Inggris" / "English", in the visitor's language. */
export function languageName(code: string, locale: Locale): string {
  return new Intl.DisplayNames([intlLocale[locale]], { type: 'language' }).of(code) ?? code;
}

/** Fills `{name}` placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

const dictionaries: Record<Locale, Dictionary> = { id, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
