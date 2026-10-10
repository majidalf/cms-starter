import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Page container (design/Design.pen → Home · Desktop 1440 → Grid Lines).
 * 1400px grid centered in 1440 with 20px page margins.
 */
export function Container({ children, className = '' }: Props) {
  return <div className={`mx-auto w-full max-w-[1400px] px-5 ${className}`}>{children}</div>;
}
