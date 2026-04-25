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

    const isPortrait = meta.platform === 'tiktok' || meta.platform === 'instagram'
    const wrapperClass = `video-wrapper ${isPortrait ? 'portrait' : ''}`

    return (
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Loading skeleton */}
        {!loaded && (
          <div className={`${wrapperClass} shimmer rounded-2xl`}>
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

        <div className={wrapperClass} style={{ display: loaded ? 'block' : 'none' }}>
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

  // ── Facebook Card (server-side extraction + native video player) ───────────
  if (meta.platform === 'facebook') {
    return <FacebookCard url={meta.originalUrl} />
  }

  // ── React Player (direct files, Twitter, TikTok) ───────────────────────────
  if (meta.playerType === 'react-player') {
    const isPortrait = meta.platform === 'tiktok' || meta.platform === 'instagram'
    const wrapperClass = `video-wrapper ${isPortrait ? 'portrait' : ''}`

    return (
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {!loaded && !error && (
          <div className={`${wrapperClass} shimmer rounded-2xl`}>
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
          <div className={wrapperClass} style={{ display: loaded ? 'block' : 'none' }}>
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

function FacebookCard({ url }: { url: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'private' | 'error'>('loading')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [title, setTitle] = useState('Facebook Video')
  const [quality, setQuality] = useState('')
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    setStatus('loading')
    setVideoUrl(null)
    setVideoError(false)

    fetch(`/api/facebook?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(data => {
        if (data.videoUrl) {
          setVideoUrl(data.videoUrl)
          setThumbnail(data.thumbnail || null)
          setTitle(data.title || 'Facebook Video')
          setQuality(data.quality || '')
          setStatus('success')
        } else if (data.error === 'login_required') {
          setStatus('private')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [url])

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(24,119,242,0.25)' }}>
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: 'rgba(24,119,242,0.08)', borderBottom: '1px solid rgba(24,119,242,0.15)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="text-white text-sm font-semibold truncate flex-1">{title}</span>
        {quality && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: 'rgba(24,119,242,0.2)', color: '#7aabff', border: '1px solid rgba(24,119,242,0.3)' }}>
            {quality}
          </span>
        )}
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="py-20 flex flex-col items-center gap-4" style={{ background: 'rgba(10,10,20,0.9)' }}>
          <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="1.5">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          <span className="text-sm" style={{ color: '#6b8cce' }}>Fetching Facebook video...</span>
        </div>
      )}

      {/* Success — play video directly */}
      {status === 'success' && videoUrl && !videoError && (
        <div className="video-wrapper" style={{ background: '#000' }}>
          <video
            src={videoUrl}
            controls
            autoPlay={false}
            poster={thumbnail || undefined}
            onError={() => setVideoError(true)}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      )}

      {/* Video tag failed → open on FB */}
      {status === 'success' && videoError && (
        <div className="px-6 py-10 text-center" style={{ background: 'rgba(10,10,20,0.9)' }}>
          <p className="text-white font-medium mb-2">Video could not load directly</p>
          <p className="text-sm mb-6" style={{ color: '#6b8cce' }}>Facebook may have restricted direct access. Open it on Facebook to watch.</p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ background: '#1877F2', color: '#fff', textDecoration: 'none' }}>
            Watch on Facebook ↗
          </a>
        </div>
      )}

      {/* Private video */}
      {status === 'private' && (
        <div className="px-6 py-12 text-center" style={{ background: 'rgba(10,10,20,0.9)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.25)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Private Video</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: '#6b8cce' }}>
            This video is set to Friends Only or Private. You need to be logged into Facebook to view it.
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ background: '#1877F2', color: '#fff', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Open on Facebook
          </a>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="px-6 py-12 text-center" style={{ background: 'rgba(10,10,20,0.9)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Could Not Load Video</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: '#8888aa' }}>
            This video may be private, deleted, or unavailable in your region.
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
            style={{ background: 'rgba(255,107,53,0.1)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.2)', textDecoration: 'none' }}>
            Try Opening on Facebook ↗
          </a>
        </div>
      )}
    </div>
  )
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
