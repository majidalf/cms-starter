'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { underlineLinkClass, type UnderlineLinkSize } from '@/components/ui/UnderlineLink';

interface Props {
  children: ReactNode;
  size?: UnderlineLinkSize;
}

/** "Print this page" in an article's tools - the browser's own print dialog. */
export function PrintButton({ children, size = 'touch' }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={underlineLinkClass(size, 'cursor-pointer')}
    >
      {children}
      <Icon name="print" className="h-4 w-4 shrink-0" />
    </button>
  );
}
