import { describe, expect, it } from 'vitest';
import { getImageDimensions, sanityImageLoader, urlForImage } from '@/lib/sanity/image';
import imageLoader from '@/lib/sanity/imageLoader';

describe('getImageDimensions', () => {
  it('reads the original size from the asset id', () => {
    expect(getImageDimensions({ asset: { _ref: 'image-abc-1200x800-jpg' } })).toEqual({
      width: 1200,
      height: 800,
    });
  });

  it('is undefined without a parseable asset', () => {
    expect(getImageDimensions({ asset: null })).toBeUndefined();
    expect(getImageDimensions({ asset: { _ref: 'file-abc-pdf' } })).toBeUndefined();
  });
});

describe('sanityImageLoader', () => {
  it('asks the Sanity CDN for the requested width, quality and format', () => {
    const src = urlForImage({ asset: { _ref: 'image-abc-1200x800-jpg' } }).url();
    const url = new URL(sanityImageLoader({ src, width: 640, quality: 60 }));
    expect(url.hostname).toBe('cdn.sanity.io');
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      w: '640',
      q: '60',
      auto: 'format',
      fit: 'max',
    });
  });

  it('defaults quality to 75 and is the next/image loader file', () => {
    const url = new URL(imageLoader({ src: 'https://cdn.sanity.io/images/p/d/a.jpg', width: 10 }));
    expect(url.searchParams.get('q')).toBe('75');
  });
});
