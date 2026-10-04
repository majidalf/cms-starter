import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';
import { defaultLocale } from '@/lib/i18n';
import './globals.css';

// The root layout lives in app/[locale], so a notFound() below it - or a URL with no
// matching route - has no root layout to render a normal not-found.tsx in. Next's
// global-not-found (experimental.globalNotFound in next.config.ts) renders this complete
// document instead. It gets no params, so it shows every language.
export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <main id="main" className="flex-1">
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
