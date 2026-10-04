# New project checklist

> Provisioning steps (Sanity project, R2, D1, secrets, domain, Studio deploy) are written in
> phase T6. This file currently holds only the corporate preset section.

## Corporate preset: relabel, rename, or remove collections

The template ships eight corporate collections (plan Section 4.3): `person`, `service`,
`industry`, `caseStudy`, `insight`, `office`, `jobOpening`, `credential`. Per client, decide
for each one: keep as is, relabel, rename its route, or remove.

### Relabel (e.g. "Service" → "Practice Area")

1. `studio/schemaTypes/documents/<type>.ts`: change `title` only. Never change `name` - queries,
   components, and existing content depend on it.
2. `web/lib/i18n.ts`: change the matching page title in both dictionaries (e.g. `services`).

### Rename a route (e.g. `/services` → `/practice-areas`)

1. `web/lib/routes.ts`: change the value.
2. Rename the folder in `web/app/[locale]/` to match. Next.js routes come from folder names, so
   both must agree.
3. `studio/schemaTypes/objects/localeSlug.ts`: update `RESERVED_PAGE_SLUGS`, so no `page`
   takes the new route name as its slug.
4. Update navigation links that use the old path (Studio → Navigation, "Site path" links).

### Remove a collection

Example: removing `industry`. Replace the names for another type; the cross-references to look
for are listed per type below.

**Studio**

1. Delete `studio/schemaTypes/documents/<type>.ts`.
2. `studio/schemaTypes/index.ts`: remove its import and its entry in `schemaTypes`.
3. Remove reference fields to it in other documents (see the table below).
4. `credential` only: also delete `credentialListSection` from
   `studio/schemaTypes/sections/index.ts`. This does not touch `person.credentials` (a
   person's own education and licenses), which is a separate field.

**Web**

5. Delete its route folder(s) in `web/app/[locale]/` (see the table).
6. Delete `web/lib/sanity/collections/<type>.ts`.
7. `web/lib/sanity/fragments.ts`: remove its card (and visibility filter, if any).
8. Remove its projections from other collections' queries (see the table).
9. `web/components/collections/entries.ts`: remove its `...Entries()` function and every call.
10. `web/lib/routes.ts`: remove its route.
11. `web/lib/revalidate.config.ts`: remove its entry, and its route from the other entries.
12. `web/lib/i18n.ts`: remove its UI text from both dictionaries (page title, "related ..."
    heading, and its label maps, e.g. `insightCategories` for `insight`).
13. Delete helpers only that type uses (the type checker doesn't flag unused files):
    - `person`: `web/components/collections/PersonList.tsx`, `web/lib/vcard.ts`.
    - `office`: remove `getOffices()` from `web/app/[locale]/layout.tsx` and the `offices` prop
      of `web/components/layout/SiteFooter.tsx`; `AddressLines.tsx` if nothing else uses it.
    - `credential`: `web/components/sections/CredentialListSection.tsx` and its case in
      `SectionRenderer.tsx`.
    - `page` slugs: drop the route from `RESERVED_PAGE_SLUGS` in
      `studio/schemaTypes/objects/localeSlug.ts`.

**Regenerate and check** - the type checker finds whatever was missed:

```bash
cd studio && npm run typegen && npm run schema:validate && npm run build
cd ../web && npm run format && npm run typecheck && npm run lint && npm run build
```

`npm run format` is needed because removing imports leaves lines Prettier wants to rejoin.

Then search for leftovers, e.g. `grep -rni "industr" web/app web/lib web/components studio/schemaTypes`.

**Content**

14. `studio/seed/sample.ndjson`: remove its documents and every reference to them.
15. Delete its documents from the dataset (`npx sanity documents delete <id> ...`), or
    re-import the seed with `--replace` on a fresh dataset.
16. Studio → Navigation: remove menu links to its route.

| Type | Route folder(s) in `web/app/[locale]/` | Referenced from (schema field → query) | Also shown in |
|---|---|---|---|
| `person` | `about/leadership/` (incl. `[slug]/vcard`) | `service.keyContacts`, `insight.authors` | service, insight detail |
| `service` | `services/` | `person.services`, `caseStudy.services`, `insight.services` | person, industry, case study, insight detail |
| `industry` | `industries/` | `service.industries`, `caseStudy.industries` | service, case study detail |
| `caseStudy` | `case-studies/` | - | service, industry detail (`references()`) |
| `insight` | `insights/` | - | service, person detail (`references()`) |
| `office` | `contact/` | `person.office` | footer (`app/[locale]/layout.tsx`, `SiteFooter`), person detail, vCard |
| `jobOpening` | `careers/` | - | - |
| `credential` | none (page builder section) | `credentialListSection` in `PAGE_FIELDS` (`lib/sanity/queries.ts`) | `components/sections/CredentialListSection.tsx`, `SectionRenderer` |
