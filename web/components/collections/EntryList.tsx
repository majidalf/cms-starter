import Link from 'next/link';

export interface Entry {
  key: string;
  href: string;
  title: string;
  /** Short line above the title, e.g. "Press Release · 12 March 2026". */
  meta?: string;
  summary?: string;
}

interface Props {
  entries: Entry[];
  /** Heading level of each entry title: h2 on list pages, h3 inside a "related" block. */
  headingLevel?: 'h2' | 'h3';
  emptyText?: string;
}

/** Plain list of linked entries for list pages and "related" blocks. */
export function EntryList({ entries, headingLevel = 'h2', emptyText }: Props) {
  if (entries.length === 0) return emptyText ? <p className="text-muted">{emptyText}</p> : null;
  const Heading = headingLevel;

  return (
    <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
      {entries.map((entry) => (
        <li key={entry.key} className="flex flex-col gap-2 border-t border-ink/15 pt-5">
          {entry.meta && <p className="text-xs uppercase tracking-wide text-muted">{entry.meta}</p>}
          <Heading className="font-serif text-xl text-brand">
            <Link href={entry.href} className="hover:underline hover:underline-offset-4">
              {entry.title}
            </Link>
          </Heading>
          {entry.summary && <p className="text-sm text-muted">{entry.summary}</p>}
        </li>
      ))}
    </ul>
  );
}
