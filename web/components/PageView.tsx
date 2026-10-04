import type { Locale } from '@/lib/i18n';
import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { SectionRenderer, startsWithHero } from '@/components/sections/SectionRenderer';
import type { PAGE_BY_SLUG_QUERY_RESULT } from '@/sanity.types';

interface Props {
  page: NonNullable<PAGE_BY_SLUG_QUERY_RESULT>;
  locale: Locale;
}

/** Body of a `page` document. Shows the title as <h1> unless a leading hero provides it. */
export function PageView({ page, locale }: Props) {
  return (
    <>
      {!startsWithHero(page.sections) && (
        <Container className="pb-4 pt-16 md:pt-24">
          <h1 className="font-serif text-4xl text-brand md:text-5xl">
            {localize(page.title, locale)}
          </h1>
        </Container>
      )}
      <SectionRenderer sections={page.sections} locale={locale} />
    </>
  );
}
