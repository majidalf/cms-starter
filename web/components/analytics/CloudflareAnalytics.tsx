const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

/**
 * Cloudflare Web Analytics beacon. Renders nothing unless
 * `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` is configured, so local/staging
 * builds without a token stay free of third-party requests.
 *
 * Server component on purpose: the `<script defer>` tag needs no client JS.
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
  if (!token) return null;
  return <script defer src={BEACON_SRC} data-cf-beacon={JSON.stringify({ token })} />;
}
