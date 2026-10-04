import type { Address } from '@/sanity.types';

interface Props {
  address: Address | null | undefined;
  className?: string;
}

/** A Sanity `address` as postal lines: street, city + postal code, province, country. */
export function AddressLines({ address, className }: Props) {
  if (!address) return null;
  const cityLine = [address.city, address.postalCode].filter(Boolean).join(' ');
  const lines = [address.street, cityLine, address.province, address.country].filter(
    (line): line is string => Boolean(line),
  );
  if (lines.length === 0) return null;

  return (
    <address className={`not-italic ${className ?? ''}`}>
      {lines.map((line) => (
        <span key={line} className="block whitespace-pre-line">
          {line}
        </span>
      ))}
    </address>
  );
}
