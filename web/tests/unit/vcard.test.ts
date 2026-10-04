import { describe, expect, it } from 'vitest';
import { buildVCard, escapeVCardText } from '@/lib/vcard';

describe('escapeVCardText', () => {
  it('escapes backslash, comma, semicolon and every newline style', () => {
    expect(escapeVCardText('a\\b,c;d\ne\r\nf\rg')).toBe('a\\\\b\\,c\\;d\\ne\\nf\\ng');
  });
});

describe('buildVCard', () => {
  it('builds a minimal card from a name', () => {
    expect(buildVCard({ name: 'Ratna Wulandari' })).toBe(
      'BEGIN:VCARD\r\nVERSION:3.0\r\nN:;Ratna Wulandari;;;\r\nFN:Ratna Wulandari\r\nEND:VCARD\r\n',
    );
  });

  it('adds every known field, escaped', () => {
    const card = buildVCard({
      name: 'Sari',
      title: 'Partner, Risk',
      organization: 'PT Contoh; Tbk',
      email: 'sari@example.com',
      phone: '+62 21 0000',
      url: 'https://www.example.com/en/about/leadership/sari',
      address: {
        street: 'Jl. Contoh 1, Lt. 2',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12190',
        country: 'Indonesia',
      },
    });
    const lines = card.split('\r\n');
    expect(lines).toContain('TITLE:Partner\\, Risk');
    expect(lines).toContain('ORG:PT Contoh\\; Tbk');
    expect(lines).toContain('EMAIL;TYPE=INTERNET,WORK:sari@example.com');
    expect(lines).toContain('TEL;TYPE=WORK,VOICE:+62 21 0000');
    expect(lines).toContain(
      'ADR;TYPE=WORK:;;Jl. Contoh 1\\, Lt. 2;Jakarta;DKI Jakarta;12190;Indonesia',
    );
    expect(lines).toContain('URL:https://www.example.com/en/about/leadership/sari');
    expect(lines.at(-2)).toBe('END:VCARD');
  });

  it('cannot inject extra properties through a newline in a value', () => {
    const card = buildVCard({ name: 'X\r\nEMAIL:attacker@example.com' });
    expect(card.split('\r\n').filter((line) => line.startsWith('EMAIL'))).toEqual([]);
  });

  it('skips an address with no filled fields', () => {
    expect(buildVCard({ name: 'X', address: { city: null, street: '' } })).not.toContain('ADR');
  });
});
