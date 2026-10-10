import type { Locale } from '@/lib/i18n';

type Localized<T> = Partial<Record<Locale, T | null>> | null | undefined;

/** Picks one language from a field-level-translated Sanity value (`{id: ..., en: ...}`).
 * No fallback to the other language on purpose: Studio requires every language before
 * publish, so a missing value is a content bug that should show up, not be papered over. */
export function localize<T>(value: Localized<T>, locale: Locale): T | undefined {
  return value?.[locale] ?? undefined;
}

export function localizeSlug(slug: Localized<string>, locale: Locale): string | undefined {
  return localize(slug, locale) || undefined;
}

/** Picks one language from each item of a localized list, dropping items it is missing in. */
export function localizeList(
  values: readonly Localized<string>[] | null | undefined,
  locale: Locale,
): string[] {
  return (values ?? [])
    .map((value) => localize(value, locale))
    .filter((value): value is string => Boolean(value));
}
