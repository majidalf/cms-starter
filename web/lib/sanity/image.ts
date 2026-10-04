import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

/** Matches the shape the Sanity schema (studio/schemaTypes) produces for image fields.
 * Not importing types from the `sanity` package here on purpose - this app only ever reads
 * content, it doesn't need the Studio's full type surface for one small shape. */
export interface SanityImageRef {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

const builder = createImageUrlBuilder(sanityClient);

/** For building a specific transform URL directly (e.g. a fixed-size thumbnail). */
export function urlForImage(source: SanityImageRef) {
  return builder.image(source);
}

interface NextImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/** Custom next/image loader hitting Sanity's own image CDN: next/image's sharp-based
 * optimizer doesn't run on Cloudflare Workers, so all resizing happens on Sanity's CDN.
 * `src` must already be a full Sanity CDN URL (from urlForImage(...).url()), not a raw
 * asset ref. */
export function sanityImageLoader({ src, width, quality }: NextImageLoaderParams): string {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
