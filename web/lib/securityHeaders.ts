/**
 * Security headers for every page and route handler, applied through `headers()` in
 * next.config.ts (plan Section 5.4). public/_headers only reaches static assets served by
 * the Workers assets binding, not responses rendered by the Worker.
 *
 * CSP without nonces, on purpose: a nonce needs a fresh value per request, which forces
 * every page to render dynamically and gives up the static/ISR cache this template is
 * built on (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * Next.js inlines its own bootstrap scripts, so script-src needs 'unsafe-inline'. The rest
 * of the policy still blocks foreign scripts, frames, plugins and form targets.
 */

export interface HeaderEntry {
  key: string;
  value: string;
}

/** Origins the site loads from besides itself. Add analytics/embeds per project here. */
const SANITY_CDN = 'https://cdn.sanity.io';
// Cloudflare Web Analytics beacon script host and the endpoint it reports to.
const CF_BEACON_SCRIPT = 'https://static.cloudflareinsights.com';
const CF_BEACON_API = 'https://cloudflareinsights.com';
// Cloudflare Turnstile (contact form spam check): its script, and the frame it renders in.
const CF_TURNSTILE = 'https://challenges.cloudflare.com';

/** Images from scripts/mock-sanity.mjs, in `next dev` only. */
function localSanityHost(isDev: boolean): string {
  const host = process.env.NEXT_PUBLIC_SANITY_LOCAL_HOST;
  return isDev && host ? ` ${host}` : '';
}

export function contentSecurityPolicy(isDev: boolean): string {
  const directives = [
    "default-src 'self'",
    // 'unsafe-eval' only for next dev (React Refresh); never in a production build.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} ${CF_BEACON_SCRIPT} ${CF_TURNSTILE}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${SANITY_CDN}${localSanityHost(isDev)}`,
    "font-src 'self'",
    `connect-src 'self' ${CF_BEACON_API}${isDev ? ' ws:' : ''}`,
    // PDF attachments and other files are linked from the Sanity CDN, never embedded: the
    // only frame is the Turnstile challenge.
    `frame-src ${CF_TURNSTILE}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join('; ');
}

export function securityHeaders(isDev: boolean): HeaderEntry[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(isDev) },
    // Browsers ignore HSTS on plain-http origins, so this is harmless on localhost.
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    },
  ];
}
