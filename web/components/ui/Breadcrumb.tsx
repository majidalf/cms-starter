import Link from 'next/link';

export interface Crumb {
  label: string;
  /** The last item is the current page and has no link. */
  href?: string;
}

interface Props {
  items: Crumb[];
  /** Accessible name of the nav landmark. */
  label: string;
}

/** "Practice Areas / Corporate & Commercial Law" above a page title. */
export function Breadcrumb({ items, label }: Props) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-[14px] leading-[17px] lg:gap-x-[10px]">
        {items.map((item, index) => (
          <li key={item.label} className="flex gap-x-2 lg:gap-x-[10px]">
            {index > 0 && (
              <span aria-hidden="true" className="text-on-navy-2">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-on-navy-2 transition-colors hover:text-brass-light"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-on-navy">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
