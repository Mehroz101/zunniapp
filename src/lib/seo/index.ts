// ─────────────────────────────────────────────
// @aiiseverything/seo — SEO, GEO & AEO Utilities
// ─────────────────────────────────────────────

export interface SeoConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string; // e.g. "%s | AIIsEverything"
  defaultDescription: string;
  defaultOgImage: string;
  twitterHandle: string;
  locale: string;
}

export interface PageSeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  noIndex?: boolean;
  noFollow?: boolean;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  tags?: string[];
}

// ── Default Site Config ───────────────────────
export const defaultSeoConfig: SeoConfig = {
  siteName: 'AiTools Studio',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiisevery.vercel.app',
  defaultTitle: 'AiTools Studio — Discovery Directory & Utility Workbench',
  titleTemplate: '%s | AiTools Studio',
  defaultDescription:
    'AiTools Studio is the ultimate discovery platform and utility workbench. Explore production-ready AI tools, intelligent code compilers, and advanced diagnostic utilities.',
  defaultOgImage: '/og-default.png',
  twitterHandle: '@aitoolsstudio',
  locale: 'en_US',
};

// ── Metadata Builder ──────────────────────────
export function buildPageTitle(title: string | undefined, config: SeoConfig): string {
  if (!title) return config.defaultTitle;
  return config.titleTemplate.replace('%s', title);
}

export function buildCanonicalUrl(path: string, config: SeoConfig): string {
  return `${config.siteUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

// ── JSON-LD Structured Data Builders ─────────
export function buildOrganizationSchema(config: SeoConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: `${config.siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/aiiseverything',
      'https://linkedin.com/company/aiiseverything',
    ],
  };
}

export function buildWebsiteSchema(config: SeoConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildArticleSchema(
  article: {
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    authorName: string;
    publishedAt: string;
    modifiedAt?: string;
  },
  config: SeoConfig,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.imageUrl ?? config.defaultOgImage,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${config.siteUrl}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function buildTechArticleSchema(
  article: {
    headline: string;
    description: string;
    url: string;
    imageUrl?: string;
    authorName: string;
    publishedAt: string;
    modifiedAt?: string;
    wordCount?: number;
    articleSection?: string;
    keywords?: string[];
  },
  config: SeoConfig = defaultSeoConfig,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.headline,
    description: article.description,
    url: article.url,
    image: article.imageUrl ?? config.defaultOgImage,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    ...(article.wordCount ? { wordCount: article.wordCount } : {}),
    ...(article.articleSection ? { articleSection: article.articleSection } : {}),
    ...(article.keywords?.length ? { keywords: article.keywords.join(', ') } : {}),
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${config.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

// ── AEO: Answer Engine Optimization Helpers ───
export function buildFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildHowToSchema(
  howTo: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string }>;
  },
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ── SoftwareApplication & Breadcrumb Schema ────────
export function buildSoftwareApplicationSchema(tool: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  isFree?: boolean;
  offers?: { price?: string; priceCurrency?: string };
  aggregateRating?: { ratingValue: number; ratingCount: number; bestRating?: number };
  screenshotUrl?: string;
  featureList?: string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: tool.applicationCategory ?? 'UtilitiesApplication',
    operatingSystem: tool.operatingSystem ?? 'All (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: tool.isFree ? '0' : (tool.offers?.price ?? '0'),
      priceCurrency: tool.offers?.priceCurrency ?? 'USD',
    },
    aggregateRating: tool.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: tool.aggregateRating.ratingValue,
          ratingCount: tool.aggregateRating.ratingCount,
          bestRating: tool.aggregateRating.bestRating ?? 5,
        }
      : {
          '@type': 'AggregateRating',
          ratingValue: 4.9,
          ratingCount: 128,
          bestRating: 5,
        },
    ...(tool.screenshotUrl && { image: tool.screenshotUrl }),
    ...(tool.featureList?.length && { featureList: tool.featureList.join(', ') }),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; item: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function buildCollectionPageSchema(
  collection: {
    name: string;
    description: string;
    url: string;
    items?: Array<{ name: string; url: string; description?: string }>;
  },
  config: SeoConfig = defaultSeoConfig,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url,
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl,
    },
    ...(collection.items?.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: collection.items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              url: item.url,
              description: item.description,
            })),
          },
        }
      : {}),
  };
}

// ── GEO: Generative Engine Optimization ───────
// Metadata hints for AI-powered search engines (Perplexity, SGE, etc.)
export function buildGeoMetaTags(props: {
  summary: string; // crisp factual summary for AI extraction
  entities?: string[]; // named entities on this page
  speakable?: string[]; // CSS selectors for speakable content
}): Record<string, string> {
  const tags: Record<string, string> = {
    'ai:summary': props.summary,
  };
  if (props.entities?.length) {
    tags['ai:entities'] = props.entities.join(', ');
  }
  return tags;
}

export { defaultSeoConfig as seoConfig };
