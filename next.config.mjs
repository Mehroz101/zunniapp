/** @type {import('next').NextConfig} */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://prod.spline.design https://*.spline.design;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://freetoolsstore.online https://*.freetoolsstore.online https://prod.spline.design https://*.spline.design https://*.vercel.app https://aiiseverythingback.vercel.app http://localhost:4000 ws: wss: https:;
  frame-src 'self' https://*.spline.design https://my.spline.design;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig = {
  // ── Standalone Output for Docker / Isolated Serverless Deployment ──
  output: 'standalone',

  // ── Experimental Features ──
  experimental: {
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge'],
    agentUpgrade: 'security',
    turbopackPluginRuntimeStrategy: 'forceWorkerThreads',
  },

  // ── Remote Image Optimization Patterns ──
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'freetoolsstore.online' },
      { protocol: 'https', hostname: '**.freetoolsstore.online' },
      { protocol: 'https', hostname: 'aiiseverything.com' },
      { protocol: 'https', hostname: '**.aiiseverything.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'prod.spline.design' },
      { protocol: 'https', hostname: '**.spline.design' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ── Performance & Server Hardening ──
  compress: true,
  poweredByHeader: false,

  // ── Enterprise-Grade Security Headers ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Long cache for immutable static assets
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ── Redirects (SEO Canonical Preservation) ──
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
