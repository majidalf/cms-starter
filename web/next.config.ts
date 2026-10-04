import path from 'node:path';
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { defaultLocale } from './lib/i18n';

// Gives `next dev` access to Cloudflare bindings (R2/D1) locally, matching what the
// deployed Worker sees - without this, local dev can't exercise the incremental/tag cache.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // web/ has its own package-lock.json next to studio/'s - pin the workspace root
  // explicitly so Turbopack doesn't have to guess between lockfiles.
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // The root layout is in app/[locale], so not-found.tsx can't catch notFound() there:
    // the server sent an empty error shell instead of the 404 page. global-not-found.tsx
    // renders a complete 404 document instead.
    globalNotFound: true,
  },
  images: {
    // next/image's default sharp-based optimizer doesn't run on Cloudflare Workers -
    // all resizing happens on Sanity's own image CDN instead. See lib/sanity/image.ts.
    loader: 'custom',
    loaderFile: './lib/sanity/imageLoader.ts',
  },
  async redirects() {
    // Every page lives under a language prefix (app/[locale]). Not permanent, so the
    // default language can change later without browsers having cached the old target.
    return [{ source: '/', destination: `/${defaultLocale}`, permanent: false }];
  },
};

export default nextConfig;
