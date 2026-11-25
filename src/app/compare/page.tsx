import type { Metadata } from 'next';
import { FormatHubPage } from '@/components/article/FormatHubPage';
import { getCmsArticles } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'AI Tool Comparisons & Benchmarks',
  description:
    'Data-driven head-to-head AI tool comparisons, feature matrices, pricing breakdowns, and engineering benchmarks on TOOLty.',
  alternates: { canonical: 'https://toolty.online/compare' },
};

export const revalidate = 60;

export default async function CompareHubPage() {
  const articles = await getCmsArticles('COMPARISON', 100);

  return (
    <FormatHubPage
      kind="compare"
      badge="HEAD-TO-HEAD BENCHMARKS"
      headingPrefix="Tool Comparisons &"
      headingAccent="Benchmark Reviews"
      description="Unbiased technical comparisons, capability breakdowns, and real-world developer benchmarks across leading AI tools."
      ctaLabel="Read Comparison"
      emptyTitle="Comparisons Coming Soon"
      emptyDescription="Publish a Tool Comparison from your CMS dashboard and it will appear here immediately."
      articles={articles}
    />
  );
}
