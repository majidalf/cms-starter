import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

/*
 * CTA Button (Design.pen → 01 Components, States → Primary button): square 2px corners,
 * label + arrow. Hover changes the fill and moves the arrow 4px; pressed darkens the fill.
 * `navy` is the variant used on the paper panel.
 */

const BASE =
  'group inline-flex items-center gap-[14px] rounded-control px-6 py-[18px] text-base font-medium leading-[19px] transition-colors duration-200';

const VARIANTS = {
  paper: 'bg-paper text-ink hover:bg-brass-light active:bg-paper-pressed',
  navy: 'bg-navy-900 text-on-navy hover:bg-navy-700 active:bg-navy-800',
} as const;

export type CtaVariant = keyof typeof VARIANTS;

export const ctaArrowClass =
  'h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:translate-x-1';

export function ctaButtonClass(variant: CtaVariant = 'paper', className = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

interface Props {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  className?: string;
}

export function CtaButton({ href, children, variant = 'paper', className = '' }: Props) {
  return (
    <Link href={href} className={ctaButtonClass(variant, className)}>
      {children}
      <Icon name="arrowRight" className={ctaArrowClass} />
    </Link>
  );
}
