import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

/** Minimal shape shared by every Sanity image field (`image`, `imageWithAlt`, ...), loose
 * enough to accept the generated types in sanity.types.ts. */
export interface SanityImageRef {
  _type?: string;
  asset?: { _ref: string } | null;
  hotspot?: { x?: number; y?: number; height?: number; width?: number } | null;
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
}

const builder = createImageUrlBuilder(sanityClient);

/** For building a specific transform URL directly (e.g. a fixed-size thumbnail). */
export function urlForImage(source: SanityImageRef) {
  return builder.image(source);
}

/** Sanity encodes the original size in the asset id (`image-<hash>-1200x800-jpg`), so
 * next/image can get explicit dimensions (no layout shift) without an extra query. */
export function getImageDimensions(
  source: SanityImageRef,
): { width: number; height: number } | undefined {
  const match = source.asset?._ref.match(/-(\d+)x(\d+)-[a-z0-9]+$/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined;
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
