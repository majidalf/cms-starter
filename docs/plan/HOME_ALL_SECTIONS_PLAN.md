# Implementation Plan: Home Page Full Sections (Harianja & Putra Law Firm)

## Objective
Implement all missing home page sections (`About`, `Partners`, `PracticeAreas`, `Sectors`, `Insights`, `Contact`, `Footer`) in `web/components/sections/` matching the layout specifications in `Design.pen`.

## Sections to Build / Refine:
1. **AboutSection.tsx**: Editorial statement + key facts.
2. **PartnersSection.tsx**: Law firm leadership / core partners showcase.
3. **PracticeAreasSection.tsx**: Interactive practice areas list with detail panel.
4. **SectorsSection.tsx**: Grid of industries/sectors served.
5. **InsightsSection.tsx**: Latest legal insights & notes.
6. **ContactSection.tsx**: Office locations (Jakarta, Denpasar) & quick inquiry trigger.
7. **Footer.tsx**: Corporate editorial footer with legal disclaimers.

## Execution Steps
1. Create the component files under `web/components/sections/`.
2. Integrate them into `web/app/[locale]/page.tsx`.
3. Run Quality Gates (`lint`, `format:check`, `typecheck`, `test`, `build`).
