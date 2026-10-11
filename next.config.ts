import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Output ──────────────────────────────────
  // Use 'standalone' for Docker deployments, 'export' for static hosting
  output: process.env.NEXT_OUTPUT_MODE === 'export' ? 'export' : undefined,

  // ── Experimental ────────────────────────────
  experimental: {
    // PPR: Partial Pre-rendering (Next 15+)
    ppr: false,
    // Optimized package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ── Images ──────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'aiiseverything.com' },
      { protocol: 'https', hostname: '**.aiiseverything.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ── Performance ──────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Security Headers ─────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Long cache for static assets
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  // ── Redirects (SEO canonical redirects) ──────
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true, // 301 — keeps link equity
      },
    ];
  },

  // ── Rewrites (clean URLs for SEO) ────────────
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
