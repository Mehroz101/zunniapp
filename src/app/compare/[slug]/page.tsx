import type { Metadata } from 'next';
import { buildArticlePageMetadata, UnifiedArticlePage } from '@/lib/article-page';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildArticlePageMetadata(slug, 'compare');
}

export default async function CompareSinglePage({ params }: PageProps) {
  const { slug } = await params;
  return <UnifiedArticlePage slug={slug} format="compare" />;
}
