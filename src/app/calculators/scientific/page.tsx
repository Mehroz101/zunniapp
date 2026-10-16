import type { Metadata } from 'next';
import { getAllCalculators } from '@/lib/config/calculators';
import { CalculatorsDirectoryView } from '@/components/calculators/CalculatorsDirectoryView';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Scientific, Physics & Engineering Calculators | AiTools Studio',
  description:
    'Dedicated calculation engines for kinematics, Ohm’s law, 3D geometry, chemical molar mass, statistics, unit conversions, and health metrics.',
  openGraph: {
    title: 'Scientific, Physics & Engineering Calculators',
    description: 'Real-time scientific formulas, physics kinematics, geometry, and health measurement engines.',
    url: 'https://aiisevery.vercel.app/calculators/scientific',
    siteName: 'AiTools Studio',
  },
  alternates: {
    canonical: 'https://aiisevery.vercel.app/calculators/scientific',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ScientificCalculatorsPage() {
  const specializedCalculators = getAllCalculators().filter((c) => c.category === 'specialized');

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
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Scientific',
        item: 'https://aiisevery.vercel.app/calculators/scientific',
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
          initialCategory="specialized"
          badgeText="SCIENTIFIC & SPECIALIZED ENGINES"
          headingTitle="Scientific & Engineering"
          headingAccent="Calculation Suite"
          headingSubtitle="Explore mathematical, physical kinematics, electrical resistance, chemical molar, and geometric calculation engines with zero server latency."
        />
      </main>

      <Footer />
    </div>
  );
}
