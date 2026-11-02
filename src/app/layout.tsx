import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

// ── Fonts ─────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
});

// ── Site-wide Metadata ───────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolty.online'),

  title: {
    default: 'TOOLty — Free Online Tools, Calculators & Utility Workbench',
    template: '%s | TOOLty',
  },

  description:
    'TOOLty is your free online utility workbench. Explore 100% free developer utilities, financial calculators, unit converters, and online tools.',

  keywords: [
    'free online tools',
    'free calculators',
    'financial calculators',
    'developer tools',
    'code converters',
    'TOOLty',
    'online utilities',
    'hex to pantone',
    'ascii converter',
    'base64 converter',
  ],

  authors: [{ name: 'TOOLty Team', url: 'https://toolty.online' }],
  creator: 'TOOLty',
  publisher: 'TOOLty',

  // ── Open Graph ───────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolty.online',
    siteName: 'TOOLty',
    title: 'TOOLty — Free Online Tools, Calculators & Utility Workbench',
    description:
      'Curated zero-latency developer utilities, financial calculators, formatters, converters, and free tools.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'TOOLty',
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'TOOLty — Free Online Tools, Calculators & Utility Workbench',
    description: 'Curated zero-latency developer utilities, financial calculators, formatters, converters, and free tools.',
    site: '@toolty',
    creator: '@toolty',
    images: ['/og-default.png'],
  },

  // ── Favicon & App Icons ──────────────────────
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  // ── Robots ───────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification ─────────────────────────────
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  // ── App ──────────────────────────────────────
  applicationName: 'TOOLty',
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#05070c' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ── Root Layout ───────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen max-w-full overflow-x-hidden bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#FF8A00]/30 selection:text-slate-950 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
