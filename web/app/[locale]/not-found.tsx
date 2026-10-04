import Link from 'next/link';
import { getDictionary, localePath, locales } from '@/lib/i18n';
import { Container } from '@/components/ui/Container';

// not-found.tsx gets no params, and reading them client-side (useParams) failed to render
// on the server - so the 404 shows every language, each marked with its own `lang`.
export default function NotFound() {
  return (
    <Container className="flex flex-col gap-12 py-24">
      {locales.map((locale, index) => {
        const t = getDictionary(locale);
        const Heading = index === 0 ? 'h1' : 'h2';
        return (
          <section key={locale} lang={locale} className="flex flex-col gap-4">
            <Heading className="font-serif text-4xl text-brand">{t.notFoundTitle}</Heading>
            <p className="text-muted">{t.notFoundBody}</p>
            <Link href={localePath(locale)} className="underline underline-offset-2">
              {t.backHome}
            </Link>
          </section>
        );
      })}
    </Container>
  );
}
