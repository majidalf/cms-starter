import { describe, expect, it } from 'vitest';
import {
  defaultLocale,
  formatDate,
  getDictionary,
  isLocale,
  languageName,
  localePath,
  locales,
  pathsForAllLocales,
} from '@/lib/i18n';

describe('isLocale', () => {
  it('accepts every configured locale', () => {
    for (const locale of locales) expect(isLocale(locale)).toBe(true);
  });

  it('rejects anything else, including near misses', () => {
    for (const value of ['fr', 'ID', 'id-ID', '', 'about']) expect(isLocale(value)).toBe(false);
  });

  it('has Indonesian as the default locale', () => {
    expect(defaultLocale).toBe('id');
  });
});

describe('localePath', () => {
  it('prefixes the path with the language', () => {
    expect(localePath('en', '/services')).toBe('/en/services');
  });

  it('returns the language root without a path', () => {
    expect(localePath('id')).toBe('/id');
  });
});

describe('pathsForAllLocales', () => {
  it('builds one path per locale and keeps undefined for missing ones', () => {
    expect(pathsForAllLocales((lang) => (lang === 'id' ? '/id/x' : undefined))).toEqual({
      id: '/id/x',
      en: undefined,
    });
  });
});

describe('formatDate', () => {
  it('formats a Sanity date in the visitor language', () => {
    expect(formatDate('2026-03-12', 'en')).toBe('12 March 2026');
    expect(formatDate('2026-03-12', 'id')).toBe('12 Maret 2026');
  });

  it('never shifts the day for datetime values (read as UTC)', () => {
    expect(formatDate('2026-03-12T23:30:00Z', 'en')).toBe('12 March 2026');
  });

  it('returns undefined for empty or invalid input', () => {
    expect(formatDate(null, 'en')).toBeUndefined();
    expect(formatDate(undefined, 'en')).toBeUndefined();
    expect(formatDate('not-a-date', 'en')).toBeUndefined();
  });
});

describe('languageName', () => {
  it('names a language in the visitor language', () => {
    expect(languageName('en', 'en')).toBe('English');
    expect(languageName('en', 'id')).toBe('Inggris');
  });
});

/** Every key, with nested maps flattened as "parent.child". */
function keysOf(value: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keysOf(child as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('dictionaries', () => {
  it('has the same keys in every language, all filled', () => {
    const [first, ...rest] = locales.map((locale) => getDictionary(locale));
    const expected = keysOf(first).toSorted();
    for (const dictionary of rest) expect(keysOf(dictionary).toSorted()).toEqual(expected);
    for (const dictionary of [first, ...rest]) {
      for (const key of keysOf(dictionary)) {
        const value = key
          .split('.')
          .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], dictionary);
        expect(value, key).toEqual(expect.any(String));
        expect((value as string).length, key).toBeGreaterThan(0);
      }
    }
  });
});
