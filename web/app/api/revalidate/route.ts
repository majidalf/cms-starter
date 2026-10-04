import { revalidatePath } from 'next/cache';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { NextResponse } from 'next/server';
import { resolveRevalidateTargets, type RevalidatePayload } from '@/lib/revalidate.config';

/**
 * Sanity webhook receiver. Configure in the Sanity project (once this app has a public
 * deployed URL) to POST here on publish, with the projection documented in
 * lib/revalidate.config.ts and this route's URL + SANITY_REVALIDATE_SECRET.
 *
 * Uses revalidatePath (not revalidateTag): @sanity/client doesn't go through Next's patched
 * `fetch`, so tag-based cache entries from `next: {tags: [...]}` aren't reliably attached to
 * these requests. revalidatePath works regardless of how the page's data was fetched.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET not configured' },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  let payload: RevalidatePayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const targets = resolveRevalidateTargets(payload);
  for (const { path, type } of targets) revalidatePath(path, type);

  return NextResponse.json({ revalidated: targets });
}
