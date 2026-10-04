import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import { getImageDimensions, urlForImage, type SanityImageRef } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';

interface Props {
  /** An `imageWithAlt` value. */
  image:
    (SanityImageRef & { alt?: Partial<Record<Locale, string | null>> | null }) | null | undefined;
  locale: Locale;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Renders an `imageWithAlt` field in the given language. Renders nothing without an asset. */
export function SanityImage({ image, locale, sizes, className, priority }: Props) {
  if (!image?.asset) return null;
  const dimensions = getImageDimensions(image);
  if (!dimensions) return null;

  return (
    <Image
      src={urlForImage(image).url()}
      alt={localize(image.alt, locale) ?? ''}
      width={dimensions.width}
      height={dimensions.height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
