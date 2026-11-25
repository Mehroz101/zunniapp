import type { MetadataRoute } from 'next';
import { buildDynamicSitemapEntries } from '@/lib/seo/sitemap-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildDynamicSitemapEntries();
}
