import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Article, IArticle } from '@/models/Article';
import {
  PublicArticleView,
  type PublicArticleData,
  type RelatedArticleItem,
} from '@/components/article/PublicArticleView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 🚀 1. High-Performance Static Page Generation (1-Hour ISR) 🚀
export const revalidate = 3600;
export const dynamicParams = true;

/**
 * Pre-generate static HTML for top published guides at build time.
 */
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const articles = await Article.find({ type: 'guide', status: 'published' })
      .select('slug')
      .limit(30)
      .lean();

    return articles.map((art) => ({
      slug: (art as unknown as { slug: string }).slug,
    }));
  } catch (error) {
    console.warn('⚠️ [generateStaticParams /guides] Fallback to on-demand generation:', error);
    return [];
  }
}

/**
 * Technical SEO & Comprehensive OpenGraph Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const article = (await Article.findOne({
      slug: slug.toLowerCase(),
      status: 'published',
    }).lean()) as unknown as IArticle | null;

    if (!article) {
      return {
        title: 'Guide Not Found | TOOLty',
        description: 'The requested technical guide could not be located.',
      };
    }

    const title = article.seo?.title || article.title;
    const plainText = article.content.replace(/<[^>]*>/g, '').trim();
    const description =
      article.seo?.description ||
      (plainText.length > 155 ? `${plainText.slice(0, 155)}...` : plainText) ||
      'Comprehensive technical guide on TOOLty.';

    const pageUrl = `https://toolty.online/guides/${article.slug}`;

    const imageUrl = article.featuredImage?.startsWith('http')
      ? article.featuredImage
      : article.featuredImage
      ? `https://toolty.online${article.featuredImage}`
      : 'https://toolty.online/og-default.png';

    return {
      title: `${title} | TOOLty Technical Guides`,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        type: 'article',
        title: `${title} | TOOLty`,
        description,
        url: pageUrl,
        siteName: 'TOOLty',
        publishedTime: article.createdAt ? new Date(article.createdAt).toISOString() : undefined,
        modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
        section: article.category,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | TOOLty`,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.warn('⚠️ [generateMetadata /guides] Metadata lookup fallback:', err);
    return {
      title: 'Technical Guide | TOOLty',
      description: 'Explore technical architectures and guides on TOOLty.',
    };
  }
}

/**
 * Public Technical Guide Page
 */
export default async function GuideSinglePage({ params }: PageProps) {
  const { slug } = await params;

  await connectToDatabase();

  const article = (await Article.findOne({
    slug: slug.toLowerCase(),
    status: 'published',
  }).lean()) as unknown as (Record<string, unknown> & { _id: { toString(): string } }) | null;

  if (!article) {
    notFound();
  }

  // Fetch 3 related guides in the same category or latest
  const relatedDocs = (await Article.find({
    type: 'guide',
    status: 'published',
    _id: { $ne: article._id as any },
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean()) as unknown as Array<Record<string, unknown> & { _id: { toString(): string } }>;

  const formattedArticle: PublicArticleData = {
    id: article._id.toString(),
    title: (article.title as string) || '',
    slug: (article.slug as string) || '',
    content: (article.content as string) || '',
    type: (article.type as 'guide' | 'news') || 'guide',
    category: (article.category as string) || 'AI Utilities',
    featuredImage: (article.featuredImage as string) || '',
    seo: article.seo as { title?: string; description?: string } | undefined,
    readingTime: (article.readingTime as number) || 3,
    createdAt: article.createdAt ? new Date(article.createdAt as string).toISOString() : new Date().toISOString(),
    updatedAt: article.updatedAt ? new Date(article.updatedAt as string).toISOString() : new Date().toISOString(),
  };

  const formattedRelated: RelatedArticleItem[] = relatedDocs.map((r) => ({
    id: r._id.toString(),
    title: (r.title as string) || '',
    slug: (r.slug as string) || '',
    category: (r.category as string) || 'General',
    readingTime: (r.readingTime as number) || 3,
    type: (r.type as 'guide' | 'news') || 'guide',
    createdAt: r.createdAt ? new Date(r.createdAt as string).toISOString() : new Date().toISOString(),
    featuredImage: (r.featuredImage as string) || '',
  }));

  const imageUrl = formattedArticle.featuredImage?.startsWith('http')
    ? formattedArticle.featuredImage
    : formattedArticle.featuredImage
    ? `https://toolty.online${formattedArticle.featuredImage}`
    : 'https://toolty.online/og-default.png';

  // Google TechArticle Rich Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: formattedArticle.title,
    description:
      formattedArticle.seo?.description ||
      formattedArticle.content.replace(/<[^>]*>/g, '').slice(0, 160),
    articleSection: formattedArticle.category,
    image: imageUrl,
    datePublished: formattedArticle.createdAt,
    dateModified: formattedArticle.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'TOOLty Editorial Engineering',
      url: 'https://toolty.online',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TOOLty',
      url: 'https://toolty.online',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolty.online/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://toolty.online/guides/${formattedArticle.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicArticleView article={formattedArticle} relatedArticles={formattedRelated} />
    </>
  );
}
