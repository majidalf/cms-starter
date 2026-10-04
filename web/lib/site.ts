const url = process.env.NEXT_PUBLIC_SITE_URL;

if (!url) {
  throw new Error(
    'Missing NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com). Needed for canonical and hreflang URLs.',
  );
}

/** Public origin of the site, used as metadataBase for canonical/hreflang/Open Graph URLs. */
export const siteUrl = new URL(url);

/** `/id/services` -> `https://www.example.com/id/services` */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
