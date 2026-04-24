'use client'

import { useState, useEffect, useRef } from 'react'
import { resolveUrl, VideoMeta, PLATFORM_CONFIG } from '@/lib/resolver'
import VideoPlayer from '@/components/VideoPlayer'
import HistoryPanel from '@/components/HistoryPanel'
import AffiliateBanner from '@/components/AffiliateBanner'

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', color: '#ff0000' },
  { name: 'Vimeo', color: '#1ab7ea' },
  { name: 'Twitch', color: '#9146ff' },
  { name: 'Dailymotion', color: '#0066dc' },
  { name: 'Streamable', color: '#00f5c4' },
  { name: 'Facebook', color: '#1877f2' },
  { name: 'Direct MP4', color: '#a78bfa' },
  { name: '+ More', color: '#ff6b35' },
]

export default function Home() {
  const [url, setUrl] = useState('')
  const [meta, setMeta] = useState<VideoMeta | null>(null)
  const [history, setHistory] = useState<VideoMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sv_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  function saveToHistory(m: VideoMeta) {
    setHistory(prev => {
      const filtered = prev.filter(h => h.originalUrl !== m.originalUrl)
      const updated = [m, ...filtered].slice(0, 20)
      localStorage.setItem('sv_history', JSON.stringify(updated))
      return updated
    })
  }

  function handlePlay() {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please paste a video link first!')
      return
    }
    setError('')
    setLoading(true)

    // Small delay for UX
    setTimeout(() => {
      const resolved = resolveUrl(trimmed)
      setMeta(resolved)
      saveToHistory(resolved)
      setLoading(false)
    }, 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handlePlay()
    if (e.key === 'Escape') {
      setUrl('')
      setMeta(null)
      setError('')
    }
  }

  function handleHistoryClick(m: VideoMeta) {
    setUrl(m.originalUrl)
    setMeta(m)
    setShowHistory(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClear() {
    setMeta(null)
    setUrl('')
    setError('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const platformConfig = meta ? PLATFORM_CONFIG[meta.platform] : null

  return (
    <>
      <div className="min-h-screen grid-bg relative">

        {/* ── Ambient orbs ─────────────────────────────────── */}
        <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,196,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="fixed top-1/2 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-10">

          {/* ── Header ─────────────────────────────────────── */}
          {!meta && (
            <header className="text-center mb-16 animate-float">
              {/* Logo mark */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 relative group"
                style={{ background: 'linear-gradient(135deg, rgba(0,245,196,0.1), rgba(0,245,196,0.02))', border: '1px solid rgba(0,245,196,0.2)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_8px_rgba(0,245,196,0.5)]">
                  <path d="M5 3L19 12L5 21V3Z" fill="url(#logo-grad)" />
                  <defs>
                    <linearGradient id="logo-grad" x1="5" y1="3" x2="19" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00f5c4" />
                      <stop offset="1" stopColor="#00d1a7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 plasma-glow" />
                <div className="absolute -inset-1 bg-[#00f5c4] blur-2xl opacity-10 rounded-full" />
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                className="text-6xl md:text-8xl text-white mb-3 tracking-tighter">
                STREAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5c4] to-[#00d1a7]">VAULT</span>
              </h1>

              <p className="text-ghost text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed">
                Paste any video link from anywhere —<br />
                <span style={{ color: '#e8e8f0' }}>watch it instantly, distraction-free</span>
              </p>

              {/* Supported platforms */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {SUPPORTED_PLATFORMS.map(p => (
                  <span key={p.name} className="platform-badge text-xs"
                    style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}08` }}>
                    {p.name}
                  </span>
                ))}
              </div>
            </header>
          )}

          {/* ── Compact header when video is playing ─────── */}
          {meta && (
            <div className="flex items-center justify-between mb-8">
              <button onClick={handleClear}
                className="flex items-center gap-2 text-ghost hover:text-white transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', fontSize: '18px' }}
                  className="group-hover:text-white transition-colors">
                  STREAM<span style={{ color: '#00f5c4' }}>VAULT</span>
                </span>
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                </svg>
                History
              </button>
            </div>
          )}

          {/* ── URL Input ───────────────────────────────────── */}
          <div className="mb-8">
            <div className="relative flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste any video link — YouTube, Vimeo, Twitch, Dailymotion, and more..."
                  className="url-input w-full h-14 px-5 pr-12 rounded-xl text-white placeholder-ghost font-light text-sm md:text-base transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-body)',
                  }}
                  autoFocus
                />
                {url && (
                  <button onClick={() => { setUrl(''); setError(''); inputRef.current?.focus() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={handlePlay}
                disabled={loading}
                className="h-14 px-7 rounded-xl font-medium transition-all relative overflow-hidden group"
                style={{
                  background: loading ? 'rgba(0,245,196,0.2)' : '#00f5c4',
                  color: '#050508',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  fontSize: '16px',
                  minWidth: '120px',
                }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Loading
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      PLAY
                    </>
                  )}
                </span>
              </button>

              {history.length > 0 && !meta && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="h-14 px-4 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              )}
            </div>

            {error && (
              <p className="mt-2 text-sm pl-1" style={{ color: '#ff6b35' }}>{error}</p>
            )}

            <p className="mt-2 text-xs pl-1" style={{ color: '#444460' }}>
              Press Enter or click PLAY &nbsp;·&nbsp; Press ESC to clear
            </p>
          </div>

          {/* ── History Panel ────────────────────────────────── */}
          {showHistory && (
            <HistoryPanel
              history={history}
              onSelect={handleHistoryClick}
              onClose={() => setShowHistory(false)}
              onClear={() => {
                setHistory([])
                localStorage.removeItem('sv_history')
                setShowHistory(false)
              }}
            />
          )}

          {/* ── Video Player ─────────────────────────────────── */}
          {meta && !showHistory && (
            <div>
              {/* Platform badge + title */}
              <div className="flex items-center gap-3 mb-4">
                {platformConfig && (
                  <span className="platform-badge text-xs"
                    style={{ color: platformConfig.color, borderColor: `${platformConfig.color}40`, background: `${platformConfig.color}10` }}>
                    {platformConfig.icon} {platformConfig.label}
                  </span>
                )}
                <span className="text-ghost text-sm truncate max-w-sm">
                  {meta.originalUrl}
                </span>
              </div>

              <VideoPlayer meta={meta} />

              {/* Actions row */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={() => { navigator.clipboard?.writeText(meta.originalUrl) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy Link
                </button>

                <a href={meta.originalUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open Original
                </a>

                {/* Save Button (Replacing Download) */}
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.25)', color: '#00f5c4' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Save
                </button>

                <button onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ml-auto"
                  style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.15)', color: '#00f5c4' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Video
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-xs text-ghost uppercase tracking-widest mb-4 font-semibold opacity-50">Share with friends</div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this awesome video on StreamVault: ' + meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)', color: '#25D366' }}>
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Watching this on StreamVault: ' + meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                    Twitter / X
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.2)', color: '#1877F2' }}>
                    Facebook
                  </button>
                </div>
              </div>

              {/* Affiliate Banners */}
              <div className="mt-5 flex flex-col gap-2">
                <AffiliateBanner variant="nordvpn" />
                <AffiliateBanner variant="movavi" />
              </div>
            </div>
          )}

          {/* ── How it works (shown when idle) ───────────────── */}
          {!meta && !showHistory && (
            <>
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: '01', title: 'Paste Your Link', desc: 'YouTube, Vimeo, Twitch, Dailymotion, or any direct video URL', color: '#00f5c4' },
                  { num: '02', title: 'Auto Detected', desc: 'Platform is detected automatically — no settings required', color: '#a78bfa' },
                  { num: '03', title: 'Watch & Enjoy', desc: 'Enjoy your video in a clean, distraction-free player', color: '#ff6b35' },
                ].map(step => (
                  <div key={step.num}
                    className="p-6 rounded-2xl animated-border relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: `${step.color}20`, lineHeight: 1 }}
                      className="absolute top-4 right-5">{step.num}</div>
                    <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                      style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
                    </div>
                    <h3 className="text-white font-medium mb-2">{step.title}</h3>
                    <p className="text-ghost text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* ── Stats Section ──────────────────────────────────── */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Supported Platforms', value: '10+' },
                  { label: 'Total Downloads', value: '1.2M+' },
                  { label: 'Active Users', value: '50K+' },
                  { label: 'Free Forever', value: '100%' },
                ].map(stat => (
                  <div key={stat.label} className="p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                    <div className="text-ghost text-xs md:text-sm uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="text-center py-12 mt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col items-center gap-6">
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: '#00f5c4' }} className="text-sm font-bold opacity-80">
                STREAMVAULT
              </span>
              
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.2em] font-bold">
                <a href="/privacy" className="text-ghost hover:text-[#00f5c4] transition-all duration-300">Privacy Policy</a>
                <a href="/terms" className="text-ghost hover:text-[#00f5c4] transition-all duration-300">Terms of Service</a>
                <a href="mailto:contact@streamvault.com" className="text-ghost hover:text-[#00f5c4] transition-all duration-300">Contact</a>
              </div>

              <div className="h-px w-12 bg-white/10" />

              <span className="text-ghost opacity-40 text-[10px] tracking-widest">
                © 2026 STREAMVAULT · UNIVERSAL VIDEO PLAYER
              </span>
            </div>
          </footer>

      </div>
    </>
  )
}
