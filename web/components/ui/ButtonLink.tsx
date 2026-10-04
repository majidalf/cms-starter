import type { ResolvedLink } from '@/lib/links';
import { SiteLink } from './SiteLink';

const VARIANTS = {
  primary: 'bg-brand text-surface hover:bg-ink',
  secondary: 'border border-current text-brand hover:bg-brand hover:text-surface',
  /** For use on a brand-colored background. */
  inverse: 'bg-surface text-brand hover:bg-accent hover:text-ink',
} as const;

interface Props {
  link: ResolvedLink;
  variant?: keyof typeof VARIANTS;
}

export function ButtonLink({ link, variant = 'primary' }: Props) {
  return (
    <SiteLink
      link={link}
      className={`inline-flex items-center px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANTS[variant]}`}
    />
  );
}
