import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/*
 * Underline Link (Design.pen → 01 Components, States → Text links): a 1px rule under the
 * label. Hover turns it brass with a 2px rule - drawn as a shadow so nothing shifts.
 */

const SIZES = {
  lg: 'text-[18px] leading-[21px] pb-[6px]',
  /** 16px on phones, 18px from the desktop layout up. */
  responsive: 'text-[16px] leading-[19px] pb-[6px] lg:text-[18px] lg:leading-[21px]',
  md: 'text-[15px] leading-[18px] pb-[6px]',
  /** Mobile frames: a taller target (41.5px) around the 15px label. */
  touch:
    'text-[15px] leading-[18px] pt-4 pb-2 lg:pt-0 lg:pb-[6px] lg:text-[18px] lg:leading-[21px]',
} as const;

export type UnderlineLinkSize = keyof typeof SIZES;

const BASE =
  'inline-flex w-fit items-center gap-2 border-b border-current text-on-navy transition-colors duration-200 hover:text-brass-light hover:shadow-[0_1px_0_0_currentColor]';

export function underlineLinkClass(size: UnderlineLinkSize = 'lg', className = ''): string {
  return `${BASE} ${SIZES[size]} ${className}`;
}

interface Props {
  href: string;
  children: ReactNode;
  size?: UnderlineLinkSize;
  /** Trailing icon; omit for a plain underlined label. */
  icon?: IconName;
  external?: boolean;
  download?: boolean;
  className?: string;
}

export function UnderlineLink({
  href,
  children,
  size = 'lg',
  icon,
  external = false,
  download = false,
  className = '',
}: Props) {
  const content = (
    <>
      {children}
      {icon && <Icon name={icon} className="h-4 w-4 shrink-0" />}
    </>
  );
  const classes = underlineLinkClass(size, className);
  if (external || download) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: true } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
