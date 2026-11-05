import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Article } from '@/models/Article';
import { ArticleStudio } from '@/components/admin/ArticleStudio';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Article — TOOLty Editorial Studio',
  description: 'Distraction-free rich text editor and SEO tuning studio.',
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  await connectToDatabase();

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { slug: id.toLowerCase() };

  const article = await Article.findOne(query).lean();

  if (!article) {
    notFound();
  }

  const raw = article as unknown as Record<string, unknown> & { _id: { toString(): string } };

  const formattedArticle = {
    id: raw._id.toString(),
    title: (raw.title as string) || '',
    slug: (raw.slug as string) || '',
    content: (raw.content as string) || '',
    type: (raw.type as 'guide' | 'news') || 'guide',
    category: (raw.category as string) || 'AI Utilities',
    featuredImage: (raw.featuredImage as string) || '',
    seo: {
      title: ((raw.seo as { title?: string })?.title) || (raw.title as string) || '',
      description: ((raw.seo as { description?: string })?.description) || '',
    },
    status: (raw.status as 'draft' | 'published') || 'draft',
  };

  return <ArticleStudio initialData={formattedArticle} isEditMode={true} />;
}
