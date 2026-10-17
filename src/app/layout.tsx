import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

// ── Fonts ─────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

// ── Site-wide Metadata ───────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiisevery.vercel.app'),

  title: {
    default: 'AiTools Studio — Developer AI Operating System & Code Tools',
    template: '%s | AiTools Studio',
  },

  description:
    'AiTools Studio is the open developer operating system and intelligence suite — curated zero-latency tools, AST code converters, model diagnostics, and technical documentation.',

  keywords: [
    'artificial intelligence',
    'developer tools',
    'code converters',
    'AST transpiler',
    'WASM AI runtime',
    'prompt optimizer',
    'AiTools Studio',
    'machine learning',
    'LLM',
  ],

  authors: [{ name: 'AiTools Studio Team', url: 'https://aiisevery.vercel.app' }],
  creator: 'AiTools Studio',
  publisher: 'AiTools Studio',

  // ── Open Graph ───────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiisevery.vercel.app',
    siteName: 'AiTools Studio',
    title: 'AiTools Studio — Developer AI Operating System & Code Tools',
    description:
      'Curated zero-latency developer utilities, AST code converters, model diagnostics, and developer documentation.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'AiTools Studio',
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'AiTools Studio — Developer AI Operating System & Code Tools',
    description: 'Curated zero-latency developer utilities, AST code converters, model diagnostics, and developer documentation.',
    site: '@aitoolsstudio',
    creator: '@aitoolsstudio',
    images: ['/og-default.png'],
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
  applicationName: 'AIIsEverything',
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
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
      <body className="min-h-screen bg-white dark:bg-[#05070c] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#FF8A00]/30 selection:text-slate-950 transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
