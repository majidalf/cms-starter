/**
 * Builds a vCard 3.0 (RFC 2426) for a person's "save contact" download. Pure function, no
 * Sanity types, so it can be unit-tested on its own (T4).
 */

export interface VCardInput {
  name: string;
  title?: string;
  organization?: string;
  email?: string;
  phone?: string;
  url?: string;
  address?: {
    street?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
}

/** Text values escape backslash, comma, semicolon and newlines (RFC 2426 Section 4). */
export function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r\n|\r|\n/g, '\\n');
}

function text(value: string | null | undefined): string {
  return escapeVCardText(value ?? '');
}

export function buildVCard(input: VCardInput): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    // Many Indonesian names have no family name, so the whole name goes in "given name"
    // instead of guessing a split. Address books show FN anyway.
    `N:;${text(input.name)};;;`,
    `FN:${text(input.name)}`,
  ];
  if (input.organization) lines.push(`ORG:${text(input.organization)}`);
  if (input.title) lines.push(`TITLE:${text(input.title)}`);
  if (input.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${text(input.email)}`);
  if (input.phone) lines.push(`TEL;TYPE=WORK,VOICE:${text(input.phone)}`);
  const { address } = input;
  if (address && Object.values(address).some(Boolean)) {
    // ADR: post office box; extended address; street; city; region; postal code; country
    const parts = [address.street, address.city, address.province, address.postalCode];
    lines.push(`ADR;TYPE=WORK:;;${[...parts, address.country].map(text).join(';')}`);
  }
  if (input.url) lines.push(`URL:${input.url}`);
  lines.push('END:VCARD');
  return `${lines.join('\r\n')}\r\n`;
}
