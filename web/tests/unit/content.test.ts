import { describe, expect, it } from 'vitest';
import { en } from '@/lib/dictionaries/en';
import { id } from '@/lib/dictionaries/id';
import { fill, formatShortDate } from '@/lib/i18n';
import { firstName, nameWithTitles } from '@/lib/people';
import { localizeList } from '@/lib/sanity/localize';

describe('fill', () => {
  it('replaces named placeholders', () => {
    expect(fill('{n} of {total}', { n: '01', total: 15 })).toBe('01 of 15');
  });

  it('leaves an unknown placeholder as written', () => {
    expect(fill('Contact {name}', {})).toBe('Contact {name}');
  });
});

describe('formatShortDate', () => {
  it('formats a Sanity date as day, short month, year', () => {
    expect(formatShortDate('2026-09-12', 'en')).toBe('12 Sep 2026');
    expect(formatShortDate('2026-08-05', 'id')).toBe('05 Agu 2026');
  });

  it('returns undefined for a missing or invalid date', () => {
    expect(formatShortDate(null, 'en')).toBeUndefined();
    expect(formatShortDate('not a date', 'en')).toBeUndefined();
  });
});

describe('localizeList', () => {
  it('picks one language and drops items missing in it', () => {
    const values = [{ en: 'Corporate', id: 'Korporasi' }, { en: 'IP' }, null];
    expect(localizeList(values, 'id')).toEqual(['Korporasi']);
    expect(localizeList(values, 'en')).toEqual(['Corporate', 'IP']);
    expect(localizeList(null, 'en')).toEqual([]);
  });
});

describe('people', () => {
  it('puts titles after the name', () => {
    expect(nameWithTitles('Zico Fernando', 'S.H., M.H.')).toBe('Zico Fernando, S.H., M.H.');
    expect(nameWithTitles('Zico Fernando', null)).toBe('Zico Fernando');
  });

  it('takes the first name for the contact button', () => {
    expect(firstName('Evan Nathaniel Gunawan')).toBe('Evan');
    expect(firstName(null)).toBe('');
  });
});

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).toSorted();

/** Every key path of a dictionary, so the two languages can be compared. */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value))
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => keyPaths(child, `${prefix}.${key}`));
  }
  return [prefix];
}

describe('dictionaries', () => {
  it('have the same keys in both languages', () => {
    expect(keyPaths(id).toSorted()).toEqual(keyPaths(en).toSorted());
  });

  it('use the same placeholders in both languages', () => {
    const pairs: [string, string][] = [
      [en.practice.of, id.practice.of],
      [en.seeAllPracticeAreas, id.seeAllPracticeAreas],
      [en.partner.firmPhone, id.partner.firmPhone],
      [en.partner.contactCta, id.partner.contactCta],
      [en.partner.ctaHeading, id.partner.ctaHeading],
      [en.article.by, id.article.by],
      [en.legal.updated, id.legal.updated],
      [en.home.practiceHeading, id.home.practiceHeading],
    ];
    for (const [english, indonesian] of pairs) {
      expect(placeholders(indonesian)).toEqual(placeholders(english));
    }
  });
});
