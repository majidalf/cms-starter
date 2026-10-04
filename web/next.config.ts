import path from 'node:path';
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { defaultLocale } from './lib/i18n';
import { securityHeaders } from './lib/securityHeaders';

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
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders(process.env.NODE_ENV === 'development') },
      {
        // *.workers.dev serves preview versions and the default subdomain - never the
        // client's domain - so keep it out of search results whatever the dataset.
        source: '/:path*',
        has: [{ type: 'host', value: String.raw`.*\.workers\.dev` }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async redirects() {
    // Every page lives under a language prefix (app/[locale]). Not permanent, so the
    // default language can change later without browsers having cached the old target.
    return [{ source: '/', destination: `/${defaultLocale}`, permanent: false }];
  },
};

export default nextConfig;
