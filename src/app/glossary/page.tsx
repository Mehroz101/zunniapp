import type { Metadata } from 'next';
import { FormatHubPage } from '@/components/article/FormatHubPage';
import { getCmsArticles } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'AI Glossary & Engineering Encyclopedia | TOOLty',
  description:
    'Clear definitions, developer terminology, LLM concepts, and production engineering terms curated by TOOLty.',
  alternates: { canonical: 'https://toolty.online/glossary' },
};

export const revalidate = 60;

export default async function GlossaryHubPage() {
  const articles = await getCmsArticles('GLOSSARY', 100);

  return (
    <FormatHubPage
      kind="glossary"
      badge="AI & ENGINEERING GLOSSARY"
      headingPrefix="AI Concepts &"
      headingAccent="Technical Glossary"
      description="Concise, authoritative definitions of frontier AI concepts, model architectures, and modern developer tooling."
      ctaLabel="Read Definition"
      emptyTitle="Glossary Entries Coming Soon"
      emptyDescription="Publish a Glossary Term from your CMS dashboard and it will appear here immediately."
      articles={articles}
    />
  );
}
