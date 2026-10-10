import type { ReactNode } from 'react';

interface Props {
  label: string;
  /** Large display heading next to the label (home page sections). */
  heading?: string;
  children: ReactNode;
  id?: string;
  /** Side padding of the page: 40px on the home page, 20px on inner pages. */
  inset?: 'home' | 'page';
  /** Tailwind classes for the section's bottom padding (and top, where a frame has one). */
  spacing: string;
  /** Space between the heading row and the content. */
  gap?: string;
  /** Phones show the label as a 32px display heading (the profile and practice frames). */
  isHeadingOnMobile?: boolean;
  /** A plain navy band behind the section, hiding the page's vertical grid lines. */
  isSolid?: boolean;
}

const INSET = {
  home: { section: 'lg:px-10', label: 'lg:w-[calc((100%+40px)/3)]' },
  page: { section: 'lg:px-5', label: 'lg:w-1/3' },
} as const;

/**
 * The two-column section used across the design: a small label in the first third of the
 * 1400px grid, content in the other two thirds. With `heading`, the label and heading share
 * the first row and the content sits under the heading, indented to the same column.
 */
export function LabeledSection({
  label,
  heading,
  children,
  id,
  inset = 'page',
  spacing,
  gap = 'gap-6 lg:gap-14',
  isHeadingOnMobile = false,
  isSolid = false,
}: Props) {
  const labelSize = isHeadingOnMobile
    ? 'max-lg:font-display max-lg:text-[32px] max-lg:leading-[34px] max-lg:text-on-navy'
    : 'max-lg:text-[14px] max-lg:leading-[17px]';
  const labelClass = `text-on-navy-2 lg:shrink-0 lg:text-[14px] lg:leading-[17px] ${labelSize} ${INSET[inset].label}`;

  const section = !heading ? (
    <section
      id={id}
      className={`relative mx-auto flex w-full max-w-[1440px] scroll-mt-24 flex-col gap-5 px-4 lg:flex-row lg:gap-0 ${INSET[inset].section} ${spacing}`}
    >
      <h2 className={labelClass}>{label}</h2>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </section>
  ) : (
    <section
      id={id}
      className={`relative mx-auto flex w-full max-w-[1440px] scroll-mt-24 flex-col px-4 ${gap} ${INSET[inset].section} ${spacing}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
        <p className={labelClass}>{label}</p>
        <h2 className="flex-1 font-display text-[44px] leading-[46px] tracking-[-0.6px] text-on-navy lg:text-[min(4.444vw,64px)] lg:leading-[1.047]">
          {heading}
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div aria-hidden="true" className={`hidden lg:block ${INSET[inset].label}`} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </section>
  );

  return isSolid ? <div className="relative bg-navy-950">{section}</div> : section;
}
