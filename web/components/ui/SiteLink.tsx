import Link from 'next/link';
import type { ResolvedLink } from '@/lib/links';

interface Props {
  link: ResolvedLink;
  className?: string;
}

/** Renders a resolved Sanity link: next/link on-site, a new tab for external URLs. */
export function SiteLink({ link, className }: Props) {
  if (link.isExternal) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
