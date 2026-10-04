import { localize } from '@/lib/sanity/localize';
import { Container } from '@/components/ui/Container';
import { SanityImage } from '@/components/SanityImage';
import type { SectionProps } from './types';

/** Credentials approved for display (the query filters on approvedForDisplay), placed on a
 * page by the editor through the page builder. */
export function CredentialListSection({ section, locale }: SectionProps<'credentialListSection'>) {
  const intro = localize(section.intro, locale);
  const credentials = section.credentials ?? [];
  if (credentials.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-serif text-3xl text-brand">{localize(section.heading, locale)}</h2>
          {intro && <p className="text-muted">{intro}</p>}
        </div>
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential) => (
            <li key={credential._id} className="flex items-start gap-4 border-t border-ink/15 pt-5">
              <SanityImage
                image={credential.logo}
                locale={locale}
                sizes="64px"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-ink">{localize(credential.title, locale)}</h3>
                <p className="text-sm text-muted">
                  {[credential.issuer, credential.year].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
