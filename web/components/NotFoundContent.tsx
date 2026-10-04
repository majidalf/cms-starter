import Link from 'next/link';
import { getDictionary, localePath, locales } from '@/lib/i18n';
import { Container } from '@/components/ui/Container';

/** 404 message in every language, each marked with its own `lang`. Used by
 * app/[locale]/not-found.tsx and app/global-not-found.tsx - neither receives params to tell
 * the language from. */
export function NotFoundContent() {
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
