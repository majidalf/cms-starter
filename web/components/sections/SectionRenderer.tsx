import type { Locale } from '@/lib/i18n';
import { CredentialListSection } from './CredentialListSection';
import { CtaSection } from './CtaSection';
import { FeatureListSection } from './FeatureListSection';
import { HeroSection } from './HeroSection';
import { ImageTextSection } from './ImageTextSection';
import { RichTextSection } from './RichTextSection';
import type { Section } from './types';

interface Props {
  sections: Section[] | null | undefined;
  locale: Locale;
}

/** True when the page's first section is a hero, which then renders the page's <h1>. */
export function startsWithHero(sections: Section[] | null | undefined): boolean {
  return sections?.[0]?._type === 'heroSection';
}

export function SectionRenderer({ sections, locale }: Props) {
  return (
    <>
      {(sections ?? []).map((section, index) => {
        switch (section._type) {
          case 'heroSection':
            return (
              <HeroSection
                key={section._key}
                section={section}
                locale={locale}
                isPageHeading={index === 0}
              />
            );
          case 'richTextSection':
            return <RichTextSection key={section._key} section={section} locale={locale} />;
          case 'ctaSection':
            return <CtaSection key={section._key} section={section} locale={locale} />;
          case 'featureListSection':
            return <FeatureListSection key={section._key} section={section} locale={locale} />;
          case 'imageTextSection':
            return <ImageTextSection key={section._key} section={section} locale={locale} />;
          case 'credentialListSection':
            return <CredentialListSection key={section._key} section={section} locale={locale} />;
          default:
            return null;
        }
      })}
    </>
  );
}
