import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TOOLty',
    short_name: 'TOOLty',
    description: 'TOOLty — Free Online Tools, Calculators & Utility Workbench.',
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
