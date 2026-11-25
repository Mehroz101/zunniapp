import { NextResponse } from 'next/server';
import { getArticlePublicPath, getCmsArticles } from '@/lib/cms';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = getCanonicalSiteUrl();
  const articles = await getCmsArticles('ALL', 100).catch(() => []);
  const buildDate = new Date().toUTCString();

  const itemsXml = articles
    .filter((art) => Boolean(art.slug))
    .map((art) => {
      const link = `${baseUrl}${getArticlePublicPath(art.slug, art.contentType)}`;
      const pubDate = new Date(art.publishedAt || art.createdAt || Date.now()).toUTCString();
      return [
        '    <item>',
        `      <title>${escapeXml(art.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <description>${escapeXml(art.excerpt || art.title)}</description>`,
        `      <category>${escapeXml(art.categoryName || art.contentType)}</category>`,
        `      <pubDate>${pubDate}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const rssXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>TOOLty — AI Tools, Technical Guides &amp; Dispatches</title>',
    `    <link>${escapeXml(baseUrl)}</link>`,
    '    <description>Latest developer tools, AI news, technical guides, comparisons, and engineering glossary updates from TOOLty.</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${buildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${baseUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
