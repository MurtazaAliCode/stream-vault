'use client'

import { useEffect, useRef, useState } from 'react'
import { VideoMeta } from '@/lib/resolver'

// Dynamic import for ReactPlayer (client-only)
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

interface Props {
  meta: VideoMeta
}

export default function VideoPlayer({ meta }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [showCC, setShowCC] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [meta.embedUrl])

  // ── Iframe player (YouTube, Vimeo, Twitch, etc.) ──────────────────────────
  if (meta.playerType === 'iframe') {
    let iframeUrl = meta.embedUrl
    if (meta.platform === 'youtube' && showCC) {
      iframeUrl += '&cc_load_policy=1&cc_lang_pref=en'
    }

    return (
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Loading skeleton */}
        {!loaded && (
          <div className="video-wrapper shimmer rounded-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span className="text-ghost text-sm">Loading video...</span>
              </div>
            </div>
          </div>
        )}

        <div className="video-wrapper" style={{ display: loaded ? 'block' : 'none' }}>
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            title={meta.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ border: 'none' }}
          />
        </div>

        {/* CC Button Overlay */}
        {loaded && meta.platform === 'youtube' && (
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setShowCC(!showCC)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              style={{
                background: showCC ? 'rgba(0,245,196,0.9)' : 'rgba(0,0,0,0.6)',
                color: showCC ? '#050508' : '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)'
              }}
            >
              CC {showCC ? 'ON' : 'OFF'}
            </button>
          </div>
        )}

        {/* Glow border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,245,196,0.05)' }} />
      </div>
    )
  }

  // ── React Player (direct files, Twitter, TikTok) ───────────────────────────
  if (meta.playerType === 'react-player') {
    return (
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {!loaded && !error && (
          <div className="video-wrapper shimmer rounded-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span className="text-ghost text-sm">Loading video...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <ErrorState url={meta.originalUrl} />
        )}

        {!error && (
          <div className="video-wrapper" style={{ display: loaded ? 'block' : 'none' }}>
            <ReactPlayer
              url={meta.originalUrl}
              playing={false}
              controls={true}
              width="100%"
              height="100%"
              onReady={() => setLoaded(true)}
              onError={() => setError(true)}
              config={{
                file: { attributes: { controlsList: 'nodownload' } },
              }}
            />
          </div>
        )}

      </div>
    )
  }

  return <ErrorState url={meta.originalUrl} />
}

function ErrorState({ url }: { url: string }) {
  return (
    <div className="rounded-2xl p-10 text-center"
      style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.2)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(255,107,53,0.1)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-white font-medium mb-2">This video could not be played</p>
      <p className="text-ghost text-sm mb-4">The platform may not allow embedding, or the link has expired</p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
        style={{ background: 'rgba(255,107,53,0.12)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.2)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Open Original Link
      </a>
    </div>
  )
}
