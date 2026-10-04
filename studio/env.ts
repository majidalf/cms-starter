// Shared by sanity.config.ts and sanity.cli.ts. Sanity loads SANITY_STUDIO_* vars from
// studio/.env (copy .env.example) and exposes them to the Studio bundle.
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? ''
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID. Copy studio/.env.example to studio/.env.')
}
