# Implementation Plan: Remaining Pages Redesign (Harianja & Putra Law Firm)

## Objective
Implement remaining primary client pages (`About`, `Practice Area Detail`, `Partner Profile`, `Insights`, `Contact`, `Legal Page`) in `web/app/[locale]/` matching the layout specifications in `Design.pen`.

## Pages to Refine / Build:
1. **About Page (`app/[locale]/about/page.tsx`)**: Law firm history, philosophy, and full leadership overview.
2. **Practice Area Detail Page (`app/[locale]/services/[slug]/page.tsx`)**: Detailed scope, legal basis, and key contacts.
3. **Partner Profile Page (`app/[locale]/about/leadership/[slug]/page.tsx`)**: Partner credentials, areas of work, and contact details.
4. **Contact Page (`app/[locale]/contact/page.tsx`)**: Full office details, interactive contact form, and maps info.
5. **Insights Index & Article Pages (`app/[locale]/insights/`)**: Article lists, filters, and reading layout.
6. **Legal / Disclaimer Page (`app/[locale]/legal/` or similar)**: Terms, privacy, and regulatory disclaimers.

## Execution Steps
1. Refine page components and templates with law-firm design tokens (`navy-950`, `brass`, `paper`).
2. Run Quality Gates (`lint`, `format:check`, `typecheck`, `test`, `build`).
