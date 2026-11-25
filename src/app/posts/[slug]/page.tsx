import { redirect, notFound } from 'next/navigation';
import { getArticlePublicPath, getCmsArticleBySlug } from '@/lib/cms';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GenericPostRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getCmsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  redirect(getArticlePublicPath(article.slug, article.contentType));
}
