import type { MetadataRoute } from 'next';
import { isIndexable } from '@/lib/seo';
import { siteUrl } from '@/lib/site';

/** Only the production dataset may be crawled; anything else (staging) is closed off. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
