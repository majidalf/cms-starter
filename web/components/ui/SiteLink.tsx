import Link from 'next/link';
import type { ResolvedLink } from '@/lib/links';

interface Props {
  link: ResolvedLink;
  className?: string;
  /** Optional lucide-style trailing arrow (design/Design.pen → 01 Components). */
  arrow?: 'arrow-right' | 'arrow-up-right';
}

function Arrow({ kind }: { kind: NonNullable<Props['arrow']> }) {
  const d = kind === 'arrow-right' ? 'M5 12h14M13 6l6 6-6 6' : 'M7 17L17 7M8 7h9v9';
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

/** Renders a resolved Sanity link: next/link on-site, a new tab for external URLs. */
export function SiteLink({ link, className, arrow }: Props) {
  const content = (
    <>
      {link.label}
      {arrow && <Arrow kind={arrow} />}
    </>
  );
  if (link.isExternal) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}
