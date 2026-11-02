import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCalculators, getCalculatorBySlug } from '@/lib/config/calculators';
import { CalculatorWorkbench } from '@/components/calculators/CalculatorWorkbench';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    return {
      title: 'Calculator Not Found | FreeToolsStore',
      description: 'The requested calculation engine could not be located in our directory.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freetoolsstore.online';

  return {
    title: `${calc.title} — Free Online Tool | FreeToolsStore`,
    description: calc.description,
    keywords: [...calc.tags, 'calculator', 'online tool', 'free calculator', calc.category],
    openGraph: {
      title: `${calc.title} — Free Online Tool`,
      description: calc.description,
      url: `${siteUrl}/calculators/${calc.slug}`,
      siteName: 'FreeToolsStore',
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/calculators/${calc.slug}`,
    },
  };
}

export default async function CalculatorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freetoolsstore.online';

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
        name: 'Calculators',
        item: `${siteUrl}/calculators`,
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
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    url: `${siteUrl}/calculators/${calc.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calc.faqs.map((faq) => ({
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
        <CalculatorWorkbench slug={calc.slug} />
      </main>

      <Footer />
    </div>
  );
}
