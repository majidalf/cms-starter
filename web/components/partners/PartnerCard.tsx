import Link from 'next/link';
import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, type Locale } from '@/lib/i18n';
import { nameWithTitles } from '@/lib/people';
import { routes } from '@/lib/routes';
import { localize, localizeList } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';
import { DesignNote } from '@/components/ui/DesignNote';
import { TagPill } from '@/components/ui/Pill';
import { UnderlineLink } from '@/components/ui/UnderlineLink';
import type { PEOPLE_QUERY_RESULT } from '@/sanity.types';

/** A person as projected by PERSON_CARD. Referenced people may lack a slug, lists never do. */
export type PersonCard = Omit<PEOPLE_QUERY_RESULT[number], 'slug'> & {
  slug: PEOPLE_QUERY_RESULT[number]['slug'] | null;
};

interface Props {
  person: PersonCard;
  locale: Locale;
  /** The annotation on the photo differs between frames. */
  photoNote?: string;
  /** Mobile link label: "Full profile" in the partners panel, "View profile" elsewhere. */
  profileLabel?: string;
  headingLevel?: 'h3' | 'h4';
}

const KEY = 'text-[12px] font-medium uppercase leading-[14px] tracking-[0.8px] text-on-navy';

/**
 * Partner Card (Design.pen → 01 Components → Partner Card). Desktop: photo 300×375 on the
 * left; name, role, contact, about and tags spread down the right. Mobile: photo on top,
 * then name, role, tags and a profile link. Hover zooms the photo (Motion Notes → Partner).
 */
export function PartnerCard({
  person,
  locale,
  photoNote,
  profileLabel,
  headingLevel: Heading = 'h3',
}: Props) {
  const t = getDictionary(locale);
  const href = detailPath(locale, routes.leadership, person.slug);
  const fullName = nameWithTitles(person.name, person.titles);
  const summary = localize(person.summary, locale);
  const office = localize(person.officeName, locale);
  const tags = localizeList(person.focusAreas, locale);

  return (
    <article className="group/card flex flex-col gap-4 rounded-card bg-navy-900 p-[10px] lg:flex-row lg:gap-6 lg:p-3 xl:min-h-[399px]">
      <div className="relative h-[400px] shrink-0 overflow-hidden rounded-photo bg-[linear-gradient(164deg,#2B3A55_9%,#121D31_91%)] lg:h-[300px] lg:w-[240px] xl:h-[375px] xl:w-[300px]">
        <SanityImage
          image={person.photo}
          locale={locale}
          sizes="(min-width: 1024px) 300px, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(180deg,#0B1B3400_60%,#0B1B34CC_100%)] lg:block"
        />
        <DesignNote className="absolute bottom-[14px] left-[14px] hidden whitespace-nowrap text-[12px] leading-[14px] text-on-navy lg:block">
          {photoNote ?? t.partnerCard.photoNote}
        </DesignNote>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 px-[6px] pb-2 lg:justify-between lg:gap-4 lg:py-2 lg:pl-0 lg:pr-3">
        <div className="flex flex-col gap-3 lg:gap-[6px]">
          <Heading className="font-serif text-[24px] leading-[28px] text-on-navy lg:text-[30px] lg:leading-[35px]">
            {href ? (
              <Link href={href} className="transition-colors hover:text-brass-light">
                {fullName}
              </Link>
            ) : (
              fullName
            )}
          </Heading>
          <p className="text-[15px] leading-[18px] text-on-navy-2 lg:text-[17px] lg:leading-[20px]">
            {localize(person.position, locale)}
          </p>
        </div>
        <dl className="hidden flex-col gap-1 lg:flex">
          {person.email && (
            <div className="flex gap-2">
              <dt className={KEY}>{t.partnerCard.email}</dt>
              <dd className="text-[12px] leading-[14px] text-on-navy-2">
                <a
                  href={`mailto:${person.email}`}
                  className="transition-colors hover:text-brass-light"
                >
                  {person.email}
                </a>
              </dd>
            </div>
          )}
          {office && (
            <div className="flex gap-2">
              <dt className={KEY}>{t.partnerCard.office}</dt>
              <dd className="text-[12px] leading-[14px] text-on-navy-2">{office}</dd>
            </div>
          )}
        </dl>
        {summary && (
          <div className="hidden flex-col gap-2 lg:flex">
            <p className={KEY}>{t.partnerCard.about}</p>
            <p className="text-[15px] leading-[23px] text-on-navy-2">{summary}</p>
          </div>
        )}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-[6px]">
            {tags.map((tag) => (
              <li key={tag} className="flex">
                <TagPill>{tag}</TagPill>
              </li>
            ))}
          </ul>
        )}
        {href && (
          <UnderlineLink href={href} size="md" icon="arrowUpRight" className="lg:hidden">
            {profileLabel ?? t.fullProfile}
          </UnderlineLink>
        )}
      </div>
    </article>
  );
}
