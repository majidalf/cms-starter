import type { Address } from '@/sanity.types';

interface Props {
  address: Address | null | undefined;
  className?: string;
}

/** A Sanity `address` as postal lines: street, city + postal code, province, country. */
export function AddressLines({ address, className }: Props) {
  if (!address) return null;
  // Keyed by field, not text: lines can repeat (e.g. city and province both "Jakarta").
  const lines = Object.entries({
    street: address.street,
    city: [address.city, address.postalCode].filter(Boolean).join(' '),
    province: address.province,
    country: address.country,
  }).filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (lines.length === 0) return null;

  return (
    <address className={`not-italic ${className ?? ''}`}>
      {lines.map(([field, line]) => (
        <span key={field} className="block whitespace-pre-line">
          {line}
        </span>
      ))}
    </address>
  );
}
