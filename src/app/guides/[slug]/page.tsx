import type { Metadata } from 'next';
import { buildArticlePageMetadata, UnifiedArticlePage } from '@/lib/article-page';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildArticlePageMetadata(slug, 'guides');
}

export default async function GuideSinglePage({ params }: PageProps) {
  const { slug } = await params;
  return <UnifiedArticlePage slug={slug} format="guides" />;
}
