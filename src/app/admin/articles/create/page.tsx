import React from 'react';
import type { Metadata } from 'next';
import { ArticleStudio } from '@/components/admin/ArticleStudio';

export const metadata: Metadata = {
  title: 'Create Article — TOOLty Editorial Studio',
  description: 'Distraction-free rich text editor and SEO tuning studio.',
};

export default function CreateArticlePage() {
  return <ArticleStudio isEditMode={false} />;
}
