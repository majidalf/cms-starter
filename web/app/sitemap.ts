import type { MetadataRoute } from 'next';
import { getSitemapData } from '@/lib/sanity/sitemapQuery';
import { siteUrl } from '@/lib/site';
import { buildSitemap } from '@/lib/sitemap';

// Static at build time like the pages; the publish webhook revalidates it
// (app/api/revalidate/route.ts).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getSitemapData(), siteUrl);
}
