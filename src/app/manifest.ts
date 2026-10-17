import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AiTools Studio',
    short_name: 'AiTools Studio',
    description: 'The ultimate discovery platform and utility workbench for AI tools and developer utilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070c',
    theme_color: '#FF8A00',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
