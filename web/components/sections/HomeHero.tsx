import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n';
import type { ResolvedLink } from '@/lib/links';
import { SanityImage } from '@/components/SanityImage';
import { CtaButton } from '@/components/ui/CtaButton';
import { UnderlineLink } from '@/components/ui/UnderlineLink';

interface Props {
  locale: Locale;
  eyebrow: string;
  heading: string;
  subheading?: string;
  image: Parameters<typeof SanityImage>[0]['image'];
  primaryCta?: ResolvedLink;
  secondaryCta?: ResolvedLink;
}

/**
 * Home Hero (Design.pen → Home · Desktop 1440 → Hero, 1440×860; Home · Mobile 375 → Hero,
 * 720 tall). Full-bleed photo under a navy gradient. Desktop: the intro block and both
 * actions sit top right, the eyebrow and headline bottom left. Mobile: headline first, then
 * the intro and a full-width CTA. The fixed top bar overlays the first 128px.
 *
 * The frames are 860 and 720 tall. On a shorter screen the hero is one screen high instead
 * and the headline and intro scale with the height, so the headline and the CTA are never
 * cut off below the fold.
 *
 * Motion Notes → Hero: the photo settles from 1.06, the headline rises word by word.
 */
export function HomeHero({
  locale,
  eyebrow,
  heading,
  subheading,
  image,
  primaryCta,
  secondaryCta,
}: Props) {
  // A word's position is its key: the heading is rendered once and never reordered.
  const words = heading
    .split(/\s+/)
    .filter(Boolean)
    .map((text, position) => ({ text, position, key: `${position}-${text}` }));

  return (
    <section data-home className="relative overflow-hidden bg-navy-950">
      <div className="hero-photo absolute inset-0">
        <SanityImage
          image={image}
          locale={locale}
          sizes="100vw"
          priority
          className="h-full w-full object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#08142699_0%,#081426CC_50%,#081426F5_100%)] lg:bg-[linear-gradient(102.264deg,#081426F2_6.449%,#081426B8_45.645%,#08142666_93.551%)]"
      />
      <div className="relative mx-auto flex min-h-[min(720px,100svh)] w-full max-w-[1440px] flex-col justify-end gap-[min(28px,3.4svh)] px-4 pb-[min(32px,4svh)] pt-[84px] lg:min-h-[min(860px,100svh)] lg:justify-between lg:gap-6 lg:px-5 lg:pb-10 lg:pt-[128px]">
        <div aria-hidden="true" className="hidden lg:block" />
        <div className="flex flex-col gap-[min(24px,2.6svh)] lg:order-last lg:gap-5">
          <p className="text-[13px] leading-[15px] text-brass-light lg:text-[15px] lg:leading-[18px]">
            {eyebrow}
          </p>
          <h1
            aria-label={heading}
            className="font-display text-[min(50px,13.33vw,6.2svh)] leading-[1.06] tracking-[-0.6px] text-on-navy lg:max-w-[1200px] lg:text-[min(7.222vw,104px,12.1svh)] lg:leading-[1.048]"
          >
            {words.map((word) => (
              <span key={word.key} aria-hidden="true">
                <span className="word-rise" style={{ '--i': word.position } as CSSProperties}>
                  {word.text}
                </span>{' '}
              </span>
            ))}
          </h1>
        </div>
        <div className="flex lg:justify-end">
          <div className="flex w-full flex-col gap-5 lg:w-1/2 lg:gap-7">
            {subheading && (
              <p className="text-[clamp(15px,2.1svh,17px)] leading-[1.47] text-on-navy lg:max-w-[560px] lg:text-[clamp(17px,2.8svh,24px)] lg:leading-[1.42]">
                {subheading}
              </p>
            )}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-7">
              {primaryCta && (
                <CtaButton href={primaryCta.href} className="justify-center lg:justify-start">
                  {primaryCta.label}
                </CtaButton>
              )}
              {secondaryCta && (
                <UnderlineLink href={secondaryCta.href} size="responsive" icon="arrowUpRight">
                  {secondaryCta.label}
                </UnderlineLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
