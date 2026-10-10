/*
 * Local stand-in for the Sanity query API and image CDN, for previewing a seed file without
 * importing it into a dataset. Development only - never deployed.
 *
 *   node scripts/mock-sanity.mjs ../studio/seed/harianja/harianja.ndjson
 *   NEXT_PUBLIC_SANITY_LOCAL_HOST=http://localhost:3999 npm run dev
 *
 * Images are served as stored: resize parameters are ignored.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { evaluate, parse } from 'groq-js';

const PORT = Number(process.env.MOCK_SANITY_PORT ?? 3999);
const seedPath = resolve(process.argv[2] ?? '../studio/seed/harianja/harianja.ndjson');
const seedDir = dirname(seedPath);
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const ASSET_PREFIX = 'image@file://';

/** asset id ("<hash>-<w>x<h>.<ext>") -> file on disk */
const assetFiles = new Map();

/** Width and height from a PNG (IHDR) or JPEG (first SOF marker) header. */
function imageSize(buffer) {
  if (buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  let offset = 2;
  while (offset < buffer.length) {
    const marker = buffer[offset + 1];
    const isFrameHeader = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isFrameHeader) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error('Unsupported image: only PNG and JPEG seed assets are read.');
}

function assetRef(file) {
  const path = join(seedDir, file);
  const { width, height } = imageSize(readFileSync(path));
  const hash = createHash('sha1').update(file).digest('hex');
  const ext = extname(file).slice(1);
  assetFiles.set(`${hash}-${width}x${height}.${ext}`, path);
  return `image-${hash}-${width}x${height}-${ext}`;
}

/** Replaces the import-time `_sanityAsset` marker with the `asset` reference a real
 * dataset holds after import. */
function resolveAssets(value) {
  if (Array.isArray(value)) return value.map(resolveAssets);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) =>
      key === '_sanityAsset' && typeof child === 'string' && child.startsWith(ASSET_PREFIX)
        ? ['asset', { _type: 'reference', _ref: assetRef(child.slice(ASSET_PREFIX.length)) }]
        : [key, resolveAssets(child)],
    ),
  );
}

const now = new Date().toISOString();
const dataset = readFileSync(seedPath, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => ({ _createdAt: now, _updatedAt: now, ...resolveAssets(JSON.parse(line)) }));

function readBody(request) {
  return new Promise((done, fail) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk));
    request.on('end', () => done(body));
    request.on('error', fail);
  });
}

async function queryFrom(request, url) {
  if (request.method === 'POST') {
    const { query, params } = JSON.parse(await readBody(request));
    return { query, params: params ?? {} };
  }
  const params = {};
  for (const [name, value] of url.searchParams) {
    if (name.startsWith('$')) params[name.slice(1)] = JSON.parse(value);
  }
  return { query: url.searchParams.get('query'), params };
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith('/images/')) {
      const file = assetFiles.get(url.pathname.split('/').pop() ?? '');
      if (!file) return response.writeHead(404).end();
      response.writeHead(200, {
        'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      });
      return response.end(readFileSync(file));
    }
    if (url.pathname.includes('/data/query/')) {
      const { query, params } = await queryFrom(request, url);
      const result = await (await evaluate(parse(query, { params }), { dataset, params })).get();
      response.writeHead(200, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ query, result, ms: 0 }));
    }
    response.writeHead(404).end();
  } catch (error) {
    process.stderr.write(`${error?.stack ?? error}
`);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: { description: String(error) } }));
  }
});

server.listen(PORT, () => {
  process.stdout.write(
    `mock Sanity: ${dataset.length} documents from ${seedPath} on :${PORT}
`,
  );
});
