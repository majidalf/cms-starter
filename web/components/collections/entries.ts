import { detailPath } from '@/lib/collectionRoutes';
import { formatDate, getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import type { Entry } from './EntryList';

/*
 * Turn query cards (lib/sanity/fragments.ts) into EntryList items for one language. A card
 * missing its title or slug in that language is skipped rather than rendered broken.
 */

type Localized = Partial<Record<Locale, string | null>> | null;

interface Card {
  _id: string;
  title: Localized;
  slug: Localized;
}

function toEntry(
  card: Card,
  base: string,
  locale: Locale,
  extra: Pick<Entry, 'meta' | 'summary'>,
): Entry | undefined {
  const href = detailPath(locale, base, card.slug);
  const title = localize(card.title, locale);
  if (!href || !title) return undefined;
  return { key: card._id, href, title, ...extra };
}

function compact(entries: (Entry | undefined)[]): Entry[] {
  return entries.filter((entry): entry is Entry => Boolean(entry));
}

/** "a · b", skipping empty parts. */
function joinMeta(...parts: (string | number | null | undefined)[]): string | undefined {
  const text = parts.filter((part) => part !== null && part !== undefined && part !== '');
  return text.length > 0 ? text.join(' · ') : undefined;
}

export function serviceEntries(cards: (Card & { summary: Localized })[], locale: Locale) {
  return compact(
    cards.map((card) =>
      toEntry(card, routes.services, locale, { summary: localize(card.summary, locale) }),
    ),
  );
}

export function industryEntries(cards: (Card & { summary: Localized })[], locale: Locale) {
  return compact(
    cards.map((card) =>
      toEntry(card, routes.industries, locale, { summary: localize(card.summary, locale) }),
    ),
  );
}

export function caseStudyEntries(
  cards: (Card & { summary: Localized; client: Localized; year: number | null })[],
  locale: Locale,
) {
  return compact(
    cards.map((card) =>
      toEntry(card, routes.caseStudies, locale, {
        meta: joinMeta(localize(card.client, locale), card.year),
        summary: localize(card.summary, locale),
      }),
    ),
  );
}

export function insightEntries(
  cards: (Card & { excerpt: Localized; category: string | null; publishedAt: string | null })[],
  locale: Locale,
) {
  const t = getDictionary(locale);
  return compact(
    cards.map((card) =>
      toEntry(card, routes.insights, locale, {
        meta: joinMeta(
          card.category ? t.insightCategories[card.category] : undefined,
          formatDate(card.publishedAt, locale),
        ),
        summary: localize(card.excerpt, locale),
      }),
    ),
  );
}

export function jobOpeningEntries(
  cards: (Card & {
    location: Localized;
    employmentType: string | null;
    deadline: string | null;
  })[],
  locale: Locale,
) {
  const t = getDictionary(locale);
  return compact(
    cards.map((card) => {
      const deadline = formatDate(card.deadline, locale);
      return toEntry(card, routes.careers, locale, {
        meta: joinMeta(
          localize(card.location, locale),
          card.employmentType ? t.employmentTypes[card.employmentType] : undefined,
        ),
        summary: deadline ? `${t.deadline}: ${deadline}` : undefined,
      });
    }),
  );
}
