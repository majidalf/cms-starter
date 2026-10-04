import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { safeHref } from '@/lib/links';
import { getImageDimensions, urlForImage, type SanityImageRef } from '@/lib/sanity/image';
import type { BlockContent } from '@/sanity.types';

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 675;

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageRef & { alt?: string } }) => {
      if (!value.asset) return null;
      const { width, height } = getImageDimensions(value) ?? {
        width: DEFAULT_IMAGE_WIDTH,
        height: DEFAULT_IMAGE_HEIGHT,
      };
      return (
        <Image
          src={urlForImage(value).url()}
          alt={value.alt ?? ''}
          width={width}
          height={height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="my-8 h-auto w-full"
        />
      );
    },
  },
  marks: {
    // Only off-site links open in a new tab.
    link: ({ value, children }) => {
      const href = safeHref(value?.href);
      const isExternal = href ? /^https?:\/\//.test(href) : false;
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline underline-offset-2 hover:no-underline"
        >
          {children}
        </a>
      );
    },
  },
};

interface Props {
  value?: BlockContent | null;
}

export function PortableTextRenderer({ value }: Props) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
