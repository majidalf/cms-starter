# Implementation Plan: Cloudflare Web Analytics (T5c)

## Objective
Integrate Cloudflare Web Analytics into the Next.js layout (`web/app/[locale]/layout.tsx`) using the standard beacon script snippet or a configured site token environment variable.

## Steps
1. **Check Layout Component**: Inspect `web/app/[locale]/layout.tsx` to find where analytics or third-party scripts can be cleanly embedded.
2. **Create Analytics Component**: Build a clean client or server component `web/components/analytics/CloudflareAnalytics.tsx` that reads `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` from environment variables and renders the beacon script if configured.
3. **Embed in Layout**: Insert the component into the root bilingual layout.
4. **Update Environment Examples**: Add `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` to `.env.example` and `.dev.vars.example`.
5. **Quality Gates Check**: Run lint, typecheck, tests, and build.
