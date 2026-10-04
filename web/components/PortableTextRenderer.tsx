import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlForImage, type SanityImageRef } from '@/lib/sanity/image';
import type { PortableTextBlock } from '@/lib/sanity/portableText';

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageRef & { alt?: string } }) => (
      <span className="block relative my-6 aspect-video w-full">
        <Image
          src={urlForImage(value).url()}
          alt={value.alt ?? ''}
          fill
          className="object-cover rounded-sm md:rounded-md"
        />
      </span>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
      >
        {children}
      </a>
    ),
  },
};

type Props = {
  value?: PortableTextBlock[];
};

export function PortableTextRenderer({ value }: Props) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
