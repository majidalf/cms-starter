-- Schema for @opennextjs/cloudflare's D1 tag cache (open-next.config.ts: d1NextTagCache).
-- Reverse-engineered from node_modules/@opennextjs/cloudflare/dist/api/overrides/tag-cache/
-- d1-next-tag-cache.js (INSERT/SELECT column list) - not published in the official docs as
-- of this writing. Verified working in production on majidalf.com; re-check the column list
-- after upgrading @opennextjs/cloudflare.
--
-- Apply with:
--   npx wrangler d1 execute <DATABASE_NAME> --file=./migrations/0001_create_revalidations.sql --remote
--   npx wrangler d1 execute <DATABASE_NAME> --file=./migrations/0001_create_revalidations.sql --local

CREATE TABLE IF NOT EXISTS revalidations (
  tag TEXT NOT NULL,
  revalidatedAt INTEGER NOT NULL,
  stale INTEGER,
  expire INTEGER
);

CREATE INDEX IF NOT EXISTS idx_revalidations_tag ON revalidations (tag);
