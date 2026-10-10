import type { Locale } from '@/lib/i18n';
import { resolveLink } from '@/lib/links';
import { localize } from '@/lib/sanity/localize';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { SanityImage } from '@/components/SanityImage';
import { CtaPanel } from './CtaPanel';
import { LabeledSection } from './LabeledSection';
import type { PAGE_BY_SLUG_QUERY_RESULT } from '@/sanity.types';

export type PageSection = NonNullable<NonNullable<PAGE_BY_SLUG_QUERY_RESULT>['sections']>[number];

interface Props {
  sections: PageSection[];
  locale: Locale;
}

const SPACING = 'pb-14 lg:pb-24';
const ROW = 'flex flex-col gap-2 border-t border-line-navy py-5 lg:flex-row lg:gap-10 lg:py-6';
const ROW_TITLE =
  'font-serif text-[24px] leading-[28px] text-on-navy lg:w-[380px] lg:shrink-0 lg:font-display lg:text-[28px] lg:leading-[29px]';
const ROW_TEXT =
  'flex-1 text-[16px] leading-[24px] text-on-navy-2 lg:text-[18px] lg:leading-[27px]';

/**
 * The page builder's other section types (feature list, image + text, credentials, call to
 * action), drawn with the design's own parts: the labeled two-column section, the ruled
 * list from About → How we work, and the CTA panel. Rich text sections are laid out by the
 * page itself (the Legal Page frame), and a hero only belongs to the home page.
 */
export function PageSections({ sections, locale }: Props) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'featureListSection': {
            const intro = localize(section.intro, locale);
            return (
              <LabeledSection
                key={section._key}
                label={localize(section.heading, locale) ?? ''}
                spacing={SPACING}
                isHeadingOnMobile
              >
                {intro && <p className={`${ROW_TEXT} pb-6 lg:max-w-[720px]`}>{intro}</p>}
                <ul className="flex flex-col border-b border-line-navy">
                  {(section.items ?? []).map((item) => (
                    <li key={item._key} className={ROW}>
                      <h3 className={ROW_TITLE}>{localize(item.title, locale)}</h3>
                      <p className={ROW_TEXT}>{localize(item.description, locale)}</p>
                    </li>
                  ))}
                </ul>
              </LabeledSection>
            );
          }
          case 'credentialListSection': {
            if (section.credentials.length === 0) return null;
            const intro = localize(section.intro, locale);
            return (
              <LabeledSection
                key={section._key}
                label={localize(section.heading, locale) ?? ''}
                spacing={SPACING}
                isHeadingOnMobile
              >
                {intro && <p className={`${ROW_TEXT} pb-6 lg:max-w-[720px]`}>{intro}</p>}
                <ul className="flex flex-col border-b border-line-navy">
                  {section.credentials.map((credential) => (
                    <li key={credential._id} className={ROW}>
                      <h3 className={ROW_TITLE}>{localize(credential.title, locale)}</h3>
                      <p className={ROW_TEXT}>
                        {[credential.issuer, credential.year].filter(Boolean).join(' · ')}
                      </p>
                    </li>
                  ))}
                </ul>
              </LabeledSection>
            );
          }
          case 'imageTextSection':
            return (
              <LabeledSection
                key={section._key}
                label={localize(section.heading, locale) ?? ''}
                spacing={SPACING}
                isHeadingOnMobile
              >
                <div
                  className={`flex flex-col gap-6 lg:gap-10 ${
                    section.imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  <div className="overflow-hidden rounded-card lg:w-1/2 lg:shrink-0">
                    <SanityImage
                      image={section.image}
                      locale={locale}
                      sizes="(min-width: 1024px) 460px, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                  <PortableTextRenderer value={localize(section.body, locale)} />
                </div>
              </LabeledSection>
            );
          case 'ctaSection': {
            const cta = section.cta ? resolveLink(section.cta, locale) : undefined;
            if (!cta) return null;
            return (
              <CtaPanel
                key={section._key}
                heading={localize(section.heading, locale) ?? ''}
                lead={localize(section.text, locale) ?? ''}
                cta={{ label: cta.label, href: cta.href }}
              />
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
