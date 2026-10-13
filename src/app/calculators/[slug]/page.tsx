import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCalculators, getCalculatorBySlug } from '@/lib/config/calculators';
import { CalculatorWorkbench } from '@/components/calculators/CalculatorWorkbench';
import { AutoLoanTradeInWorkbench, type CmsCalculatorData } from '@/components/calculators/AutoLoanTradeInWorkbench';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const calculators = getAllCalculators();
  return calculators.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    return {
      title: 'Calculator Not Found | AiTools Studio',
      description: 'The requested calculation engine could not be located in our directory.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiisevery.vercel.app';

  // Attempt dynamic CMS metadata overrides if available
  let cmsTitle = calc.title;
  let cmsDescription = calc.description;
  let cmsCanonical = `${siteUrl}/calculators/${calc.slug}`;

  try {
    const cmsItem = await prisma.calculator.findUnique({
      where: { slug: calc.slug },
      select: { seoTitle: true, seoDescription: true, canonicalUrl: true },
    });
    if (cmsItem?.seoTitle) cmsTitle = cmsItem.seoTitle;
    if (cmsItem?.seoDescription) cmsDescription = cmsItem.seoDescription;
    if (cmsItem?.canonicalUrl) cmsCanonical = cmsItem.canonicalUrl;
  } catch {}

  return {
    title: `${cmsTitle} — Free Online Tool | AiTools Studio`,
    description: cmsDescription,
    keywords: [...calc.tags, 'calculator', 'online tool', 'free calculator', calc.category],
    openGraph: {
      title: `${cmsTitle} — Free Online Tool`,
      description: cmsDescription,
      url: `${siteUrl}/calculators/${calc.slug}`,
      siteName: 'AiTools Studio',
      type: 'website',
    },
    alternates: {
      canonical: cmsCanonical,
    },
  };
}

export const revalidate = 3600; // 1h ISR

export default async function CalculatorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiisevery.vercel.app';

  // Fetch dynamic CMS editorial record from MongoDB via Prisma
  let cmsData: CmsCalculatorData | null = null;
  try {
    const record = await prisma.calculator.findUnique({
      where: { slug: calc.slug },
      select: {
        title: true,
        description: true,
        articleContent: true,
        faqItems: true,
      },
    });
    if (record) {
      cmsData = {
        title: record.title,
        description: record.description,
        articleContent: record.articleContent,
        faqItems: record.faqItems as Array<{ question: string; answer: string }> | undefined,
      };
    }
  } catch {}

  const isAutoLoanTradeIn = calc.slug === 'auto-loan-trade-in-equity-calculator';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isAutoLoanTradeIn ? 'Loans' : 'Calculators',
        item: isAutoLoanTradeIn ? `${siteUrl}/calculators?tab=financial` : `${siteUrl}/calculators`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: calc.title,
        item: `${siteUrl}/calculators/${calc.slug}`,
      },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calc.title,
    description: calc.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    url: `${siteUrl}/calculators/${calc.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  const activeFaqs = cmsData?.faqItems && cmsData.faqItems.length > 0 ? cmsData.faqItems : calc.faqs;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {isAutoLoanTradeIn ? (
          <AutoLoanTradeInWorkbench cmsData={cmsData} />
        ) : (
          <CalculatorWorkbench slug={calc.slug} />
        )}
      </main>

      <Footer />
    </div>
  );
}
