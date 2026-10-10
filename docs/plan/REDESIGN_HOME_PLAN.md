# Implementation Plan: Harianja & Putra Law Firm Home Page Redesign

## Objective
Implement all missing home page sections (About, Partners, Practice Areas, Sectors, Insights, Contact, Footer) using the design system from `Design.pen` (navy-950, brass, paper, on-navy, font-display, font-serif, font-body).

## Steps
1. Parse `Design.pen` to extract section names and layout specifications.
2. Create components for each section in `web/components/sections/`:
   - AboutSection
   - PartnersSection
   - PracticeAreasSection
   - SectorsSection
   - InsightsSection
   - ContactSection
   - FooterSection
3. Use Tailwind CSS tokens from `web/app/globals.css` (navy-950, brass, paper, etc.).
4. Ensure components match `Design.pen` frame dimensions and layout.
5. Run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test`, `npm run build` to verify.
