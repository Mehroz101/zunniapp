import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolty.online';
  const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

  const privatePaths = [
    '/api/',
    '/_next/',
    '/dashboard/',
    '/dashboard',
    '/admin/',
    '/admin',
    '/login',
    '/*?*draft=*',
    '/*?*preview=*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Google Search Engine & Vertex / Gemini Indexer
        userAgent: 'Googlebot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Microsoft Bing & Copilot Indexer
        userAgent: 'Bingbot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // OpenAI ChatGPT & SearchGPT Crawler
        userAgent: 'GPTBot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Anthropic Claude Crawler
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Perplexity AI Conversational Engine Crawler
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: privatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
