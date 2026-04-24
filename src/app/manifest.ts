import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StreamVault — Universal Video Player',
    short_name: 'StreamVault',
    description: 'Paste any video link and watch instantly in a clean, distraction-free player.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#00f5c4',
    id: '/',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
