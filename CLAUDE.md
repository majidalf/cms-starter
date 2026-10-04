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
cd web && npm run lint && npm run format:check && npm run typecheck && npm run build
cd studio && npm run schema:validate && npm run build   # needs studio/.env
```
