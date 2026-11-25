import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  contentTypeToFormatKey,
  extractArticleHeadings,
  formatKeyToContentType,
  getArticlePublicPath,
  getCmsArticleBySlug,
  getCmsArticles,
  type CmsFormatKey,
} from '@/lib/cms';
import {
  buildBreadcrumbSchema,
  buildGeoMetaTags,
  buildTechArticleSchema,
  getCanonicalSiteUrl,
} from '@/lib/seo';
import {
  PublicArticleView,
  type ArticleFormatType,
  type PublicArticleData,
  type RelatedArticleItem,
} from '@/components/article/PublicArticleView';

const FORMAT_DETAILS: Record<
  CmsFormatKey,
  {
    viewType: ArticleFormatType;
    sectionLabel: string;
    titleSuffix: string;
    fallbackDescription: string;
    schemaType: 'TechArticle' | 'NewsArticle';
  }
> = {
  blog: {
    viewType: 'blog',
    sectionLabel: 'Blog',
    titleSuffix: 'Blog',
    fallbackDescription: 'Read technical articles, AI analysis, and developer workflows on TOOLty.',
    schemaType: 'TechArticle',
  },
  guides: {
    viewType: 'guide',
    sectionLabel: 'Guides',
    titleSuffix: 'Technical Guides',
    fallbackDescription: 'Comprehensive technical guides and engineering architectures on TOOLty.',
    schemaType: 'TechArticle',
  },
  news: {
    viewType: 'news',
    sectionLabel: 'News',
    titleSuffix: 'AI News',
    fallbackDescription: 'Breaking AI developer news and frontier model releases on TOOLty.',
    schemaType: 'NewsArticle',
  },
  glossary: {
    viewType: 'glossary',
    sectionLabel: 'Glossary',
    titleSuffix: 'AI Glossary',
    fallbackDescription: 'Clear definitions, architecture notes, and AI terminology on TOOLty.',
    schemaType: 'TechArticle',
  },
  compare: {
    viewType: 'compare',
    sectionLabel: 'Compare',
    titleSuffix: 'Comparisons',
    fallbackDescription: 'Head-to-head AI tool and developer utility comparisons on TOOLty.',
    schemaType: 'TechArticle',
  },
};

function toViewType(contentType: string, fallback: ArticleFormatType): ArticleFormatType {
  const upper = contentType.toUpperCase();
  if (upper === 'NEWS') return 'news';
  if (upper === 'GUIDE') return 'guide';
  if (upper === 'GLOSSARY') return 'glossary';
  if (upper === 'COMPARISON' || upper === 'COMPARE') return 'compare';
  return fallback;
}

function resolveAbsoluteImage(img?: string | null): string {
  const siteUrl = getCanonicalSiteUrl();
  if (!img) return `${siteUrl}/icon.svg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
}

export async function buildArticlePageMetadata(
  slug: string,
  format: CmsFormatKey
): Promise<Metadata> {
  const siteUrl = getCanonicalSiteUrl();
  const cfg = FORMAT_DETAILS[format];
  const article = await getCmsArticleBySlug(slug);

  if (!article) {
    const fallbackTitle = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${fallbackTitle} | ${cfg.titleSuffix}`,
      description: cfg.fallbackDescription,
    };
  }

  const canonicalFormat = contentTypeToFormatKey(article.contentType);
  const canonicalCfg = FORMAT_DETAILS[canonicalFormat] || cfg;
  const pageTitle = article.seoMeta?.title || `${article.title} | ${canonicalCfg.titleSuffix}`;
  const pageDescription =
    article.seoMeta?.description || article.excerpt || canonicalCfg.fallbackDescription;
  const defaultCanonical = `${siteUrl}${getArticlePublicPath(article.slug, article.contentType)}`;
  const rawCanonical = article.seoMeta?.canonical;
  const isExternalCanonical =
    Boolean(rawCanonical?.startsWith('http')) && !rawCanonical?.startsWith(siteUrl);
  const canonicalUrl = isExternalCanonical && rawCanonical ? rawCanonical : defaultCanonical;
  const imageUrl = resolveAbsoluteImage(article.coverImage || article.seoMeta?.ogImage);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'TOOLty',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorName],
      section: article.categoryName,
      tags: article.tags,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    other: buildGeoMetaTags({
      summary: `${article.title}. ${article.excerpt}`,
      entities: [article.title, article.categoryName, 'TOOLty', ...article.tags],
    }),
  };
}

export async function UnifiedArticlePage({
  slug,
  format,
}: {
  slug: string;
  format: CmsFormatKey;
}) {
  const cfg = FORMAT_DETAILS[format];
  const article = await getCmsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Enforce a single canonical URL per contentType (prevents /blog/x vs /news/x duplicate URLs)
  const canonicalFormat = contentTypeToFormatKey(article.contentType);
  if (canonicalFormat !== format) {
    permanentRedirect(getArticlePublicPath(article.slug, article.contentType));
  }

  const siteUrl = getCanonicalSiteUrl();
  const targetContentType = formatKeyToContentType(format);
  const relatedRaw = await getCmsArticles(targetContentType, 4);
  const filteredRelated = relatedRaw
    .filter((r) => r.slug.toLowerCase() !== article.slug.toLowerCase())
    .slice(0, 3);

  const viewType = toViewType(article.contentType, cfg.viewType);
  const canonicalUrl = `${siteUrl}/${format}/${article.slug}`;
  const imageUrl = resolveAbsoluteImage(article.coverImage || article.seoMeta?.ogImage);
  const tocItems = extractArticleHeadings(article.content);

  const formattedArticle: PublicArticleData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    type: viewType,
    category: article.categoryName,
    featuredImage: article.coverImage || undefined,
    tags: article.tags,
    authorName: article.authorName,
    seo: {
      title: article.seoMeta?.title,
      description: article.seoMeta?.description,
    },
    readingTime: article.readingTimeMins,
    createdAt: article.publishedAt || article.createdAt,
    updatedAt: article.updatedAt,
  };

  const formattedRelated: RelatedArticleItem[] = filteredRelated.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.categoryName,
    readingTime: r.readingTimeMins,
    type: toViewType(r.contentType, cfg.viewType),
    createdAt: r.publishedAt || r.createdAt,
    featuredImage: r.coverImage || undefined,
  }));

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: siteUrl },
    { name: cfg.sectionLabel, item: `${siteUrl}/${format}` },
    { name: article.title, item: canonicalUrl },
  ]);

  const articleSchema =
    cfg.schemaType === 'NewsArticle'
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.excerpt,
          articleSection: article.categoryName,
          image: imageUrl,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: {
            '@type': 'Organization',
            name: article.authorName || 'TOOLty News Desk',
            url: siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: 'TOOLty',
            url: siteUrl,
            logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        }
      : buildTechArticleSchema({
          headline: article.title,
          description: article.excerpt,
          url: canonicalUrl,
          publishedAt: article.publishedAt,
          modifiedAt: article.updatedAt,
          authorName: article.authorName,
          imageUrl,
          articleSection: article.categoryName,
          keywords: article.tags,
        });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <PublicArticleView
        article={formattedArticle}
        relatedArticles={formattedRelated}
        tocItems={tocItems}
      />
    </>
  );
}
