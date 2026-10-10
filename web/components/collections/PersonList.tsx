import Link from 'next/link';
import type { ComponentProps } from 'react';
import { detailPath } from '@/lib/collectionRoutes';
import type { Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';

type Localized = Partial<Record<Locale, string | null>> | null;

/** PERSON_CARD in lib/sanity/fragments.ts. */
export interface PersonCard {
  _id: string;
  name: string | null;
  slug: Localized;
  position: Localized;
  photo: ComponentProps<typeof SanityImage>['image'];
}

/** People that can be linked in this language (name and slug present). */
export function visiblePeople<T extends PersonCard>(people: T[], locale: Locale): T[] {
  return people.filter(
    (person) => person.name && detailPath(locale, routes.leadership, person.slug),
  );
}

interface Props {
  people: PersonCard[];
  locale: Locale;
  /** h2 on a page of its own, h3 under a group heading or "related" block. */
  headingLevel?: 'h2' | 'h3';
  /** "dark" on navy backgrounds, "light" on paper panels (e.g. the About page). */
  tone?: 'dark' | 'light';
}

/**
 * People with photo, name and position, each linking to their profile.
 * Editorial cards (design/Design.pen): rounded photo, serif name, muted role.
 */
export function PersonList({ people, locale, headingLevel = 'h3', tone = 'dark' }: Props) {
  const Heading = headingLevel;
  const light = tone === 'light';
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {visiblePeople(people, locale).map((person) => {
        const href = detailPath(locale, routes.leadership, person.slug);
        if (!href) return null;
        return (
          <li key={person._id} className="flex flex-col gap-3">
            <SanityImage
              image={person.photo}
              locale={locale}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/5] w-full rounded-photo object-cover"
            />
            <Heading className={`font-serif text-xl ${light ? 'text-navy-900' : 'text-on-navy'}`}>
              <Link
                href={href}
                className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
              >
                {person.name}
              </Link>
            </Heading>
            <p className={`text-sm ${light ? 'text-ink-2' : 'text-on-navy-2'}`}>
              {localize(person.position, locale)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
