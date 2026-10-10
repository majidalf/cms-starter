import Link from 'next/link';
import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, localePath, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { getPersonBySlug } from '@/lib/sanity/collections/person';
import { localize } from '@/lib/sanity/localize';
import { SanityImage } from '@/components/SanityImage';
import type { PEOPLE_QUERY_RESULT } from '@/sanity.types';

interface Props {
  people: PEOPLE_QUERY_RESULT;
  locale: Locale;
}

const MAX_PARTNERS = 3;

/** Partners first, then leadership/board - the showcase never renders empty cards. */
export function showcasePeople(people: PEOPLE_QUERY_RESULT, locale: Locale) {
  const visible = people.filter(
    (person) => person.name && detailPath(locale, routes.leadership, person.slug),
  );
  for (const group of ['partner', 'leadership', 'board']) {
    const match = visible.filter((person) => person.group === group);
    if (match.length > 0) return match.slice(0, MAX_PARTNERS);
  }
  return visible.slice(0, MAX_PARTNERS);
}

/** First ~180 characters of portable text, for the card bio line. */
function bioExcerpt(bio: unknown, locale: Locale): string | undefined {
  const root = (bio as { [k: string]: unknown } | null)?.[locale] as unknown;
  if (!Array.isArray(root)) return undefined;
  const text = root
    .map((block) => {
      const children = (block as { children?: Array<{ text?: unknown }> })?.children;
      if (!Array.isArray(children)) return '';
      return children.map((child) => (typeof child.text === 'string' ? child.text : '')).join('');
    })
    .join('\n\n')
    .trim();
  if (!text) return undefined;
  return text.length > 180 ? `${text.slice(0, 180).trimEnd()}…` : text;
}

/**
 * Home Partners (design/Design.pen → Home · Desktop 1440 → Partners).
 * Paper panel (r20, p20, gap 20): sticky side 440px (intro 15px/1.45,
 * display H2 52px/1.05, navy CTA) + partner cards (navy-900, r16, p12,
 * gap 24). Card: photo 300×375 (r12) + body (name serif 30px/1.15,
 * role 17px, EMAIL/OFFICE 12px rows, bio 15px/1.55, tag pills).
 * Mobile: stacked cards, photo h400, profile link per card.
 */
export async function PartnersSection({ people, locale }: Props) {
  const t = getDictionary(locale);
  const ht = t.home;
  const showcase = showcasePeople(people, locale);
  if (showcase.length === 0) return null;

  const cards = await Promise.all(
    showcase.map(async (person) => {
      const slug = person.slug?.[locale];
      const href = detailPath(locale, routes.leadership, person.slug);
      const full = slug ? await getPersonBySlug(locale, slug) : null;
      const services = (full?.services ?? [])
        .map((service) => localize(service.title, locale))
        .filter((title): title is string => Boolean(title))
        .slice(0, 4);
      return {
        person,
        href,
        position: localize(person.position, locale),
        email: full?.email,
        office: full?.office ? localize(full.office.name, locale) : undefined,
        bio: bioExcerpt(full?.bio, locale),
        services,
      };
    }),
  );

  return (
    <section aria-labelledby="partners-heading" className="bg-navy-950 text-on-navy">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-5 md:px-10">
        <div className="flex flex-col gap-5 rounded-[20px] bg-paper p-3 text-navy-900 md:p-5 lg:flex-row">
          <div className="flex shrink-0 flex-col gap-4 p-2 self-start md:p-[8px_4px] lg:sticky lg:top-24 lg:w-[440px]">
            <p className="text-[15px] leading-[1.45] text-ink-2 md:max-w-[300px]">
              {ht.partnersIntro}
            </p>
            <h2
              id="partners-heading"
              className="font-display text-[38px] leading-[1.05] tracking-[-0.6px] text-ink uppercase md:text-[52px]"
            >
              {ht.partnersHeading}
            </h2>
            <div aria-hidden="true" className="hidden h-[120px] w-px lg:block" />
            <div>
              <Link
                href={localePath(locale, routes.contact)}
                className="inline-flex items-center gap-[14px] rounded-[2px] bg-navy-900 px-6 py-[18px] text-base font-medium text-on-navy transition-colors hover:bg-navy-700 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
              >
                {ht.contactCta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-[14px]">
            {cards.map(({ person, href, position, email, office, bio, services }) => (
              <article
                key={person._id}
                className="flex flex-col gap-4 rounded-2xl bg-navy-900 p-[10px] text-on-navy md:flex-row md:gap-6 md:p-3"
              >
                {person.photo ? (
                  <SanityImage
                    image={person.photo}
                    locale={locale}
                    sizes="(min-width: 768px) 300px, 100vw"
                    className="h-[400px] w-full shrink-0 rounded-xl object-cover md:h-[375px] md:w-[300px]"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-[400px] w-full shrink-0 rounded-xl bg-navy-800 md:h-[375px] md:w-[300px]"
                  />
                )}
                <div className="flex flex-1 flex-col justify-between gap-4 px-[6px] pb-2 md:gap-3 md:px-3 md:py-2">
                  <div className="flex flex-col gap-[6px]">
                    <h3 className="font-serif text-[24px] leading-[1.15] text-on-navy md:text-[30px]">
                      {href ? (
                        <Link
                          href={href}
                          className="transition-colors hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                        >
                          {person.name}
                        </Link>
                      ) : (
                        person.name
                      )}
                    </h3>
                    {position && (
                      <p className="text-[15px] text-on-navy-2 md:text-[17px]">{position}</p>
                    )}
                  </div>
                  {(email || office) && (
                    <dl className="flex flex-col gap-1">
                      {email && (
                        <div className="flex items-baseline gap-2">
                          <dt className="text-xs font-medium tracking-[0.8px] text-on-navy uppercase">
                            Email
                          </dt>
                          <dd className="text-xs text-on-navy-2">
                            <a href={`mailto:${email}`} className="hover:text-brass-light">
                              {email}
                            </a>
                          </dd>
                        </div>
                      )}
                      {office && (
                        <div className="flex items-baseline gap-2">
                          <dt className="text-xs font-medium tracking-[0.8px] text-on-navy uppercase">
                            Office
                          </dt>
                          <dd className="text-xs text-on-navy-2">{office}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {bio && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-medium tracking-[0.8px] text-on-navy uppercase">
                        About
                      </p>
                      <p className="text-[15px] leading-[1.55] text-on-navy-2">{bio}</p>
                    </div>
                  )}
                  {services.length > 0 && (
                    <ul className="flex flex-wrap gap-[6px]" aria-label={t.relatedServices}>
                      {services.map((service) => (
                        <li
                          key={service}
                          className="rounded-full border border-navy-700 px-[10px] py-[4px] text-xs text-on-navy"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
