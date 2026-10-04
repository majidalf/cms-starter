import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import d1NextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache';

/**
 * R2 (not KV) for the incremental/ISR cache - Cloudflare's own OpenNext docs actively
 * recommend against KV here ("eventually consistent").
 *
 * D1 for the tag cache - required because app/api/revalidate/route.ts calls
 * revalidatePath (App Router revalidation needs a tag cache; Pages Router apps don't).
 * The `revalidations` table this needs isn't auto-created - see
 * migrations/0001_create_revalidations.sql, applied manually via wrangler d1 execute.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
});
