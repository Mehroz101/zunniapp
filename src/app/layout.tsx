import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiiseverything.com'),

  title: {
    default: 'AIIsEverything — AI For Every Corner of Life',
    template: '%s | AIIsEverything',
  },

  description:
    'AIIsEverything.com is your definitive guide to artificial intelligence — news, tools, tutorials, and insights for everyone.',

  keywords: [
    'artificial intelligence',
    'AI tools',
    'machine learning',
    'AI news',
    'AI tutorials',
    'generative AI',
    'ChatGPT',
    'LLM',
  ],

  authors: [{ name: 'AIIsEverything Team', url: 'https://aiiseverything.com' }],
  creator: 'AIIsEverything',
  publisher: 'AIIsEverything',

  // ── Open Graph ───────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiiseverything.com',
    siteName: 'AIIsEverything',
    title: 'AIIsEverything — AI For Every Corner of Life',
    description:
      'Your definitive guide to artificial intelligence — news, tools, tutorials, and insights.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'AIIsEverything',
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'AIIsEverything — AI For Every Corner of Life',
    description: 'Your definitive guide to artificial intelligence.',
    site: '@aiiseverything',
    creator: '@aiiseverything',
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
      <body className="min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased selection:bg-[#00D2FF]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
