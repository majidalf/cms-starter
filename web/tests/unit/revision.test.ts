import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();
vi.mock('@/lib/sanity/client', () => ({ sanityClient: { fetch: fetchMock } }));
const { waitForRevision } = await import('@/lib/sanity/revision');

describe('waitForRevision', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it('polls until the revision is visible, then waits the replica settle time', async () => {
    fetchMock.mockResolvedValueOnce('old-rev').mockResolvedValueOnce('new-rev');
    let settled = false;
    const result = waitForRevision('doc-1', 'new-rev', 'update').then((value) => {
      settled = true;
      return value;
    });
    await vi.advanceTimersByTimeAsync(250); // one poll interval
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('_rev'), { id: 'doc-1' });
    await vi.advanceTimersByTimeAsync(2_999);
    expect(settled).toBe(false); // still inside the 3 s settle
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBe(true);
  });

  it('treats a delete as visible once the document is gone', async () => {
    fetchMock.mockResolvedValueOnce(null);
    const result = waitForRevision('doc-1', undefined, 'delete');
    await vi.advanceTimersByTimeAsync(3_000);
    await expect(result).resolves.toBe(true);
  });

  it('gives up after 10 s so the webhook can be retried', async () => {
    fetchMock.mockResolvedValue('old-rev');
    const result = waitForRevision('doc-1', 'new-rev', 'update');
    await vi.advanceTimersByTimeAsync(10_500);
    await expect(result).resolves.toBe(false);
  });
});
