import type { MetadataRoute } from 'next';
import { getCanonicalSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dynamically generates /robots.txt with clean crawler organization:
 * - Allows static JS/CSS/Image bundles (`/_next/static/`, `/_next/image`) so Googlebot renders pages accurately.
 * - Blocks private dashboards, auth endpoints, internal APIs, and search/preview query-parameter crawl traps.
 * - Exposes XML Sitemap + RSS 2.0 discovery feeds and IndexNow key verification under `/seo/`.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalSiteUrl();

  const publicAssetsAllow = ['/', '/_next/static/', '/_next/image', '/seo/'];

  const disallowedPaths = [
    '/api/',
    '/_next/data/',
    '/_next/webpack-hmr',
    '/admin',
    '/admin/',
    '/dashboard',
    '/dashboard/',
    '/settings',
    '/settings/',
    '/login',
    '/search',
    '/*?*q=*',
    '/*?*search=*',
    '/*?*draft=*',
    '/*?*preview=*',
    '/*?*token=*',
    '/*?*sort=*',
  ];

  const aiContentAllow = [
    '/',
    '/_next/static/',
    '/_next/image',
    '/tools',
    '/tools/',
    '/ai-tools',
    '/ai-tools/',
    '/calculators',
    '/calculators/',
    '/toolkits',
    '/blog',
    '/blog/',
    '/guides',
    '/guides/',
    '/news',
    '/news/',
    '/glossary',
    '/glossary/',
    '/compare',
    '/compare/',
    '/privacy',
    '/terms',
  ];

  return {
    rules: [
      {
        // Primary Search Engines (Google, Bing, Apple, DuckDuckGo, Yandex)
        userAgent: ['Googlebot', 'Googlebot-Image', 'Bingbot', 'Applebot', 'DuckDuckBot', 'Yandex'],
        allow: publicAssetsAllow,
        disallow: disallowedPaths,
      },
      {
        // AI Search & Answer Engines (OpenAI, Anthropic, Perplexity, Google AI)
        userAgent: [
          'OAI-SearchBot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
        ],
        allow: aiContentAllow,
        disallow: disallowedPaths,
      },
      {
        // Default Rule for All Other Crawlers
        userAgent: '*',
        allow: publicAssetsAllow,
        disallow: disallowedPaths,
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/rss.xml`],
    host: baseUrl,
  };
}
