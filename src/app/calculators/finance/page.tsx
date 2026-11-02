import type { Metadata } from 'next';
import { getAllCalculators } from '@/lib/config/calculators';
import { CalculatorsDirectoryView } from '@/components/calculators/CalculatorsDirectoryView';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Financial & Commercial Calculators — Loans, Investments & ROI | FreeToolsStore',
  description:
    'Dedicated calculation engines for auto trade-in equity, mortgage amortization, compound ROI, loan EMI, business margins, and tax planning.',
  openGraph: {
    title: 'Financial & Commercial Calculators — Loans, Investments & ROI',
    description: 'Explore high-precision financial engines with real-time formulas and amortization schedules.',
    url: 'https://freetoolsstore.online/calculators/finance',
    siteName: 'FreeToolsStore',
  },
  alternates: {
    canonical: 'https://freetoolsstore.online/calculators/finance',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FinanceCalculatorsPage() {
  const financialCalculators = getAllCalculators().filter((c) => c.category === 'financial');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://freetoolsstore.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://freetoolsstore.online/calculators',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Finance',
        item: 'https://freetoolsstore.online/calculators/finance',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <main className="relative pt-32 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <CalculatorsDirectoryView
          initialCategory="financial"
          badgeText="FINANCIAL & COMMERCIAL ENGINES"
          headingTitle="Precision Financial"
          headingAccent="Calculators & Planning"
          headingSubtitle="Explore our dedicated financial calculation engines for vehicle trade-ins, compound investments, mortgage amortization, and business margins."
        />
      </main>

      <Footer />
    </div>
  );
}
