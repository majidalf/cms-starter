import { resolveLinks } from '@/lib/links';
import { getDictionary } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import { SiteLink } from '@/components/ui/SiteLink';
import { SanityImage } from '@/components/SanityImage';
import type { SectionProps } from './types';

interface Props extends SectionProps<'heroSection'> {
  /** The first section on a page carries the page's only <h1>. */
  isPageHeading: boolean;
}

/**
 * Home Hero (design/Design.pen → Home · Desktop 1440 → Hero, 1440×860).
 * Full-bleed photo with a navy gradient overlay (-110°: #081426F2 → #081426B8
 * at 45% → #08142666), 6-column grid lines, right-aligned intro block
 * (24px/1.4, max 560) with the paper CTA + underline link, and the headline
 * row at the bottom (brass-light eyebrow 15px, display H1 104px/1.05, -0.6).
 * Mobile 375: eyebrow 13px, H1 50px, intro 17px, full-width CTA.
 */
export function HeroSection({ section, locale, isPageHeading }: Props) {
  const Heading = isPageHeading ? 'h1' : 'h2';
  const t = getDictionary(locale).home;
  const subheading = localize(section.subheading, locale);
  const ctas = resolveLinks(section.ctas, locale);
  const [primary, secondary] = ctas;

  return (
    <section className="relative overflow-hidden bg-navy-950 text-on-navy">
      {section.image && (
        <>
          <SanityImage
            image={section.image}
            locale={locale}
            sizes="100vw"
            priority={isPageHeading}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(200deg,#081426F2_0%,#081426B8_45%,#08142666_100%)]"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 inset-y-0 hidden grid-cols-6 md:grid"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`grid-col-${i + 1}`}
            className={`h-full border-gridline ${i === 5 ? 'border-x' : 'border-l'}`}
          />
        ))}
      </div>
      <div className="relative mx-auto flex min-h-[720px] w-full max-w-[1400px] flex-col justify-between gap-10 px-5 pb-10 pt-14 md:min-h-[860px]">
        <div className="flex w-full">
          <div aria-hidden="true" className="hidden flex-1 md:block" />
          <div className="flex w-full flex-col gap-7 md:max-w-[560px]">
            {subheading && (
              <p className="text-[17px] leading-[1.45] text-on-navy md:text-[24px] md:leading-[1.4]">
                {subheading}
              </p>
            )}
            {ctas.length > 0 && (
              <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
                {primary && (
                  <SiteLink
                    link={primary}
                    arrow="arrow-right"
                    className="inline-flex items-center justify-center gap-[14px] rounded-[2px] bg-paper px-6 py-[18px] text-base font-medium text-navy-900 transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring max-sm:w-full"
                  />
                )}
                {secondary && (
                  <SiteLink
                    link={secondary}
                    arrow="arrow-up-right"
                    className="inline-flex items-center gap-2 self-start border-b border-on-navy pb-[6px] text-base text-on-navy transition-colors hover:border-brass-light hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring sm:self-auto md:text-[18px]"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col gap-5">
            <p className="text-[13px] text-brass-light md:text-[15px]">{t.heroEyebrow}</p>
            <Heading className="max-w-full font-display text-[50px] leading-[1.05] tracking-[-0.6px] text-balance text-on-navy lg:max-w-[1200px] lg:text-[104px]">
              {localize(section.heading, locale)}
            </Heading>
          </div>
        </div>
      </div>
    </section>
  );
}
