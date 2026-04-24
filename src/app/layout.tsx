import type { Metadata } from 'next'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import AdBlockDetector from '@/components/AdBlockDetector'

export const metadata: Metadata = {
  metadataBase: new URL('https://stream-vault-omega.vercel.app'),
  title: 'StreamVault — Watch Any Video Link',
  description: 'Paste any video URL from YouTube, Vimeo, Twitch, Dailymotion, direct files and more. Watch instantly in a clean, distraction-free player.',
  keywords: 'video player, youtube player, vimeo player, watch videos online, universal video player',
  alternates: {
    canonical: '/',
  },
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
  openGraph: {
    title: 'StreamVault — Watch Any Video Link',
    description: 'Paste any video link. Watch instantly.',
    url: 'https://stream-vault-omega.vercel.app',
    siteName: 'StreamVault',
    type: 'website',
  },
  verification: {
    google: 'google8b2069e95f040ad1',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StreamVault',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#00f5c4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="scanlines noise">
        <CustomCursor />
        <AdBlockDetector />
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed');
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
