import type { Metadata } from 'next';
import './globals.css';

// Placeholder until T2a: metadata comes from siteSettings, and this layout moves under
// app/[locale]/ so <html lang> follows the active language.
export const metadata: Metadata = {
  title: '{{SITE_NAME}}',
  description: 'Built from cms-starter.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
