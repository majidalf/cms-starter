import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Integration test of app/api/revalidate/route.ts: real signature checking, mocked Next
 * cache and Sanity revision polling. */

const revalidatePath = vi.fn();
const waitForRevision = vi.fn();
vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/lib/sanity/revision', () => ({ waitForRevision }));

const { POST } = await import('@/app/api/revalidate/route');

const SECRET = 'test-secret';
const payload = { _id: 'service-risk', _rev: 'r1', _type: 'jobOpening', operation: 'update' };

async function signedRequest(body: string, secret = SECRET) {
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  return new Request('https://www.example.com/api/revalidate', {
    method: 'POST',
    headers: { [SIGNATURE_HEADER_NAME]: signature },
    body,
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', SECRET);
    revalidatePath.mockReset();
    waitForRevision.mockReset().mockResolvedValue(true);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('revalidates the targets for the published type', async () => {
    const res = await POST(await signedRequest(JSON.stringify(payload)));
    expect(res.status).toBe(200);
    expect(waitForRevision).toHaveBeenCalledWith('service-risk', 'r1', 'update');
    expect(revalidatePath.mock.calls).toEqual([
      ['/[locale]/careers', 'layout'],
      ['/sitemap.xml', undefined],
    ]);
  });

  it('500s when the secret is not configured', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '');
    const res = await POST(await signedRequest(JSON.stringify(payload)));
    expect(res.status).toBe(500);
  });

  it('401s on a missing or wrong signature', async () => {
    const unsigned = new Request('https://x/api/revalidate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect((await POST(unsigned)).status).toBe(401);
    expect((await POST(await signedRequest(JSON.stringify(payload), 'wrong'))).status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('400s on a body that is not a JSON object with _id', async () => {
    expect((await POST(await signedRequest('not json'))).status).toBe(400);
    expect((await POST(await signedRequest('null'))).status).toBe(400);
    expect((await POST(await signedRequest(JSON.stringify({ _type: 'page' })))).status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('503s so Sanity retries when the change is not visible yet', async () => {
    waitForRevision.mockResolvedValue(false);
    const res = await POST(await signedRequest(JSON.stringify(payload)));
    expect(res.status).toBe(503);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
