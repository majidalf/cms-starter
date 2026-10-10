import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { safeHref } from '@/lib/links';
import { getImageDimensions, urlForImage, type SanityImageRef } from '@/lib/sanity/image';
import type { BlockContent } from '@/sanity.types';

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 675;

/** "heading-3" -> an id the "In this article" list can link to. */
export function headingId(key: string): string {
  return `section-${key}`;
}

/** The H2s of a rich text value, for a table of contents. */
export function headingsOf(value: BlockContent | null | undefined): { id: string; text: string }[] {
  return (value ?? []).flatMap((block) => {
    if (block._type !== 'block' || block.style !== 'h2') return [];
    const text = (block.children ?? []).map((child) => child.text ?? '').join('');
    return text ? [{ id: headingId(block._key), text }] : [];
  });
}

const PARAGRAPH = 'text-[17px] leading-[29px] lg:text-[18px] lg:leading-[31px]';
const LIST_ITEM =
  'flex gap-4 border-t border-line-navy py-[14px] text-[17px] leading-[26px] last:border-b lg:text-[18px] lg:leading-[22px]';

/*
 * Article type (Design.pen → Insights Article → Article Text): the first paragraph is the
 * lead, set in the display face; H2s in the text serif; lists as ruled rows, numbered ones
 * marked (a), (b), (c); one pull quote in italic serif; links underlined, brass on hover.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${PARAGRAPH} group-data-lead/rt:first:font-display group-data-lead/rt:first:text-[22px] group-data-lead/rt:first:leading-[29px] group-data-lead/rt:first:text-on-navy lg:group-data-lead/rt:first:text-[24px] lg:group-data-lead/rt:first:leading-[34px]`}
      >
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={headingId(value._key ?? '')}
        className="scroll-mt-28 font-serif text-[26px] leading-[31px] text-on-navy lg:text-[32px] lg:leading-[38px]"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-[22px] leading-[27px] text-on-navy lg:text-[24px] lg:leading-[30px]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[17px] font-semibold leading-[26px] text-on-navy lg:text-[18px]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-serif text-[28px] italic leading-[34px] text-on-navy lg:text-[36px] lg:leading-[43px]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col">{children}</ul>,
    number: ({ children }) => <ol className="flex flex-col [counter-reset:clause]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className={LIST_ITEM}>
        <span aria-hidden="true" className="w-8 shrink-0 text-[15px] lg:w-9 lg:text-[16px]">
          •
        </span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li
        className={`${LIST_ITEM} [counter-increment:clause] before:w-8 before:shrink-0 before:text-[15px] before:tabular-nums before:content-['('counter(clause,lower-alpha)')'] lg:before:w-9 lg:before:text-[16px]`}
      >
        <span className="flex-1">{children}</span>
      </li>
    ),
  },
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
          sizes="(min-width: 1024px) 720px, 100vw"
          className="h-auto w-full rounded-photo"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = safeHref(value?.href);
      const isExternal = href ? /^https?:\/\//.test(href) : false;
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-on-navy underline underline-offset-4 transition-colors hover:text-brass-light"
        >
          {children}
        </a>
      );
    },
  },
};

interface Props {
  value?: BlockContent | null;
  /** Sets the first paragraph as the article lead. */
  hasLead?: boolean;
  /** Spacing and text color of the body; headings and quotes keep their own color. */
  className?: string;
}

export function PortableTextRenderer({
  value,
  hasLead = false,
  className = 'gap-6 text-on-navy-2 lg:gap-7',
}: Props) {
  if (!value || value.length === 0) return null;
  return (
    <div data-lead={hasLead ? '' : undefined} className={`group/rt flex flex-col ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
