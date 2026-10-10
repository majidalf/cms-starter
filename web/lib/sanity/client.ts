import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01';

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET env vars. Copy .env.example to .env.local.',
  );
}

/**
 * Read-only client for public content. No token: the dataset is public-read.
 *
 * useCdn: false on purpose. Rendered pages are cached by Next (R2), so Sanity is only
 * queried at build time and when the publish webhook revalidates a page - exactly the
 * moments that need fresh data. The API CDN can lag a few seconds behind a publish, which
 * would re-cache the old content (seen in testing: a just-published page 404'd).
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  ...localHostConfig(),
});

/** Development only: `NEXT_PUBLIC_SANITY_LOCAL_HOST` points the client at
 * scripts/mock-sanity.mjs, which serves a seed file without importing it into a dataset. */
function localHostConfig() {
  const host = sanityLocalHost();
  return host ? { apiHost: host, useProjectHostname: false } : {};
}

export function sanityLocalHost(): string | undefined {
  const host = process.env.NEXT_PUBLIC_SANITY_LOCAL_HOST;
  if (!host) return undefined;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SANITY_LOCAL_HOST is for local development only.');
  }
  return host;
}
