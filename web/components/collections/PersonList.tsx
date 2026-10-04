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

interface Props {
  people: PersonCard[];
  locale: Locale;
  /** h2 on a page of its own, h3 under a group heading or "related" block. */
  headingLevel?: 'h2' | 'h3';
}

/** People with photo, name and position, each linking to their profile. */
export function PersonList({ people, locale, headingLevel = 'h3' }: Props) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => {
        const href = detailPath(locale, routes.leadership, person.slug);
        if (!href || !person.name) return null;
        return (
          <li key={person._id} className="flex flex-col gap-3">
            <SanityImage
              image={person.photo}
              locale={locale}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
            <Heading className="font-serif text-xl text-brand">
              <Link href={href} className="hover:underline hover:underline-offset-4">
                {person.name}
              </Link>
            </Heading>
            <p className="text-sm text-muted">{localize(person.position, locale)}</p>
          </li>
        );
      })}
    </ul>
  );
}
