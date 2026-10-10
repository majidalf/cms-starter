import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';
import { fontVariables } from '@/app/fonts';
import { defaultLocale } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

// For URLs that match no route at all. Renders its own document: the site layout (header,
// footer) needs the CMS and is not available here.
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={`h-full antialiased ${fontVariables}`}>
      <body className="flex min-h-full flex-col font-sans">
        <main id="main" className="flex-1">
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
