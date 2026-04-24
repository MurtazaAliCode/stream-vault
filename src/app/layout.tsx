import type { Metadata } from 'next'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import AdBlockDetector from '@/components/AdBlockDetector'

export const metadata: Metadata = {
  title: 'StreamVault — Watch Any Video Link',
  description: 'Paste any video URL from YouTube, Vimeo, Twitch, Dailymotion, direct files and more. Watch instantly in a clean, distraction-free player.',
  keywords: 'video player, youtube player, vimeo player, watch videos online, universal video player',
  openGraph: {
    title: 'StreamVault — Watch Any Video Link',
    description: 'Paste any video link. Watch instantly.',
    type: 'website',
  },
}

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
      </body>
    </html>
  )
}
