import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, securityHeaders } from '@/lib/securityHeaders';

describe('securityHeaders', () => {
  it('sends the baseline headers from plan Section 5.4', () => {
    const keys = securityHeaders(false).map((header) => header.key);
    expect(keys).toEqual([
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]);
  });
});

describe('contentSecurityPolicy', () => {
  it('allows Sanity images and blocks framing, plugins and foreign form targets', () => {
    const csp = contentSecurityPolicy(false);
    expect(csp).toContain('https://cdn.sanity.io');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
  });

  it("only allows 'unsafe-eval' and websockets in development", () => {
    expect(contentSecurityPolicy(false)).not.toContain('unsafe-eval');
    expect(contentSecurityPolicy(false)).not.toContain('ws:');
    expect(contentSecurityPolicy(true)).toContain("'unsafe-eval'");
    expect(contentSecurityPolicy(true)).toContain('ws:');
  });
});
