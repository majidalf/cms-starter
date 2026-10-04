# cms-starter

Template repo for corporate client websites: Next.js 16 (App Router) on Cloudflare Workers via
OpenNext, content from a standalone Sanity Studio. Bilingual (Indonesian default + English).

- The plan, phases, and every decision (D-1 to D-8) live in `docs/plan/STARTER_TEMPLATE_PLAN.md`.
  Read it before changing structure. Corporate content model and per-industry variants:
  `docs/plan/CORPORATE_CLIENT_PLAN.md`.
- `web/` and `studio/` are independent npm projects (own `package.json` and lockfile, no
  workspaces). Run commands inside the folder you are changing.
- `web/` uses a Next.js version newer than most training data - read `web/AGENTS.md` and the
  docs in `web/node_modules/next/dist/docs/` before writing Next.js code.
- Tailwind 4: no `tailwind.config.ts`; design tokens live in `web/app/globals.css` under `@theme`.
- Placeholders: `{{SITE_NAME}}`, `{{SANITY_PROJECT_ID}}`, `{{D1_DATABASE_ID}}`, and the default
  Worker name `cms-starter` in `web/wrangler.jsonc` (kept valid on purpose - `next build` validates
  that file).

## Checks before committing

```bash
cd web && npm run lint && npm run format:check && npm run typecheck && npm run test && npm run build
cd studio && npm run schema:validate && npm run build   # needs studio/.env
```

After changing pages, queries or the seed, also run against the built site (seed dataset
imported): `cd web && npm run test:e2e` (Playwright + axe) and `npm run lhci` (Lighthouse,
set `CHROME_PATH` to a Chrome/Chromium binary). These default to `next start`; before
committing routing or caching changes, run them on the Worker runtime as CI does:
`npm run cf:build`, then `E2E_SERVER=worker npm run test:e2e` - OpenNext behaves differently
from `next start` (see `components/layout/LanguageSwitcher.tsx`).

Install scripts are allowed per exact version (`allowScripts` in `web/package.json`,
decision D-9). After upgrading `workerd` or `esbuild`, review the new script and lockfile
integrity before `npm approve-scripts`.
