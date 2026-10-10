import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/** On only with NEXT_PUBLIC_SHOW_DESIGN_NOTES=1, so a preview can be compared with the
 * design frame for frame. */
export const showDesignNotes = process.env.NEXT_PUBLIC_SHOW_DESIGN_NOTES === '1';

/**
 * The brass annotations in Design.pen ("Hover or select a row...", "Sample content for
 * layout only"). They are notes to the team, not site copy, so production leaves them out.
 */
export function DesignNote({ children, className = '' }: Props) {
  if (!showDesignNotes) return null;
  return <p className={`text-[13px] leading-[15px] text-brass-light ${className}`}>{children}</p>;
}
