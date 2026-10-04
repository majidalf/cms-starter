import { sanityClient } from './client';

const POLL_INTERVAL_MS = 250;
const TIMEOUT_MS = 10_000;
/** Same settle time next-sanity's parseBody() waits by default (waitForContentLakeEventualConsistency). */
const REPLICA_SETTLE_MS = 3_000;

export type DocumentOperation = 'create' | 'update' | 'delete';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits until a just-published change is visible to queries.
 *
 * A publish webhook can arrive before Sanity's query API has caught up. Revalidating then
 * re-renders the page with the old content and caches it until the next publish. Measured
 * locally (webhook sent right after an async-visibility patch): stale in 2 of 5 runs with
 * no wait, 1 of 10 when only polling for the revision - the poll and the page render can
 * hit different API replicas - and 0 with poll + settle time.
 *
 * 1. Poll until the payload's exact revision is visible (for a delete: until the document
 *    is gone). Handles long lags: returns false on timeout so the caller can fail the
 *    webhook and let Sanity retry it.
 * 2. Then wait a fixed settle time so the other replicas catch up too.
 */
export async function waitForRevision(
  id: string,
  rev: string | undefined,
  operation: DocumentOperation | undefined,
): Promise<boolean> {
  const deadline = Date.now() + TIMEOUT_MS;
  // Polling is sequential by nature: each check must finish before deciding to wait again.
  // oxlint-disable no-await-in-loop
  while (Date.now() < deadline) {
    const currentRev = await sanityClient.fetch<string | null>(`*[_id == $id][0]._rev`, { id });
    const isVisible = operation === 'delete' ? currentRev === null : currentRev === rev;
    if (isVisible) {
      await sleep(REPLICA_SETTLE_MS);
      return true;
    }
    await sleep(POLL_INTERVAL_MS);
  }
  // oxlint-enable no-await-in-loop
  return false;
}
