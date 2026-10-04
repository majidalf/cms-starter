import path from 'node:path';
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Gives `next dev` access to Cloudflare bindings (R2/D1) locally, matching what the
// deployed Worker sees - without this, local dev can't exercise the incremental/tag cache.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // web/ has its own package-lock.json next to studio/'s - pin the workspace root
  // explicitly so Turbopack doesn't have to guess between lockfiles.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // next/image's default sharp-based optimizer doesn't run on Cloudflare Workers -
    // all resizing happens on Sanity's own image CDN instead. See lib/sanity/image.ts.
    loader: 'custom',
    loaderFile: './lib/sanity/imageLoader.ts',
  },
};

export default nextConfig;
