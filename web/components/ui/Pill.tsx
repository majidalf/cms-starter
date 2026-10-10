import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 12px on cards, 14px in page content. */
  size?: 'sm' | 'md';
  className?: string;
}

const TEXT = { sm: 'text-[12px] leading-[14px]', md: 'text-[14px] leading-[17px]' } as const;

/** Tag Pill: outlined, for practice areas, sectors and categories. */
export function TagPill({ children, size = 'sm', className = '' }: Props) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-[10px] py-1 text-on-navy outline-1 -outline-offset-1 outline-navy-700 ${TEXT[size]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Citation Pill: filled, for a statute or regulation reference. */
export function CitationPill({ children, size = 'sm', className = '' }: Props) {
  return (
    <span
      className={`inline-flex w-fit rounded-full bg-chip px-[10px] py-[3px] text-on-navy-2 ${TEXT[size]} ${className}`}
    >
      {children}
    </span>
  );
}
