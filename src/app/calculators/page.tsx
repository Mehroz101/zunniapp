import type { Metadata } from 'next';
import { getAllCalculators } from '@/lib/config/calculators';
import { CalculatorsDirectoryView } from '@/components/calculators/CalculatorsDirectoryView';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Free Online Calculators — Finance, Math & Science Suite | AiTools Studio',
  description:
    'Explore 19 dedicated, zero-latency calculation engines across financial planning, business margins, mathematics, physics, geometry, health, and engineering.',
  openGraph: {
    title: 'Free Online Calculators — Finance, Math & Science Suite',
    description: 'Explore 19 dedicated calculation engines with real-time mathematical formulas and visual breakdowns.',
    url: 'https://aiisevery.vercel.app/calculators',
    siteName: 'AiTools Studio',
  },
  alternates: {
    canonical: 'https://aiisevery.vercel.app/calculators',
  },
};

export const revalidate = 3600; // 1h background ISR

export default function CalculatorsHubPage() {
  const calculators = getAllCalculators();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aiisevery.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://aiisevery.vercel.app/calculators',
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Universal 19+ Online Calculator Suite',
    description: 'High-precision financial, scientific, and specialized calculation tools.',
    url: 'https://aiisevery.vercel.app/calculators',
    hasPart: calculators.map((c) => ({
      '@type': 'SoftwareApplication',
      name: c.title,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      url: `https://aiisevery.vercel.app/calculators/${c.slug}`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <CalculatorsDirectoryView />
      </main>

      <Footer />
    </div>
  );
}
