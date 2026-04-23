'use client'

import { useState, useEffect } from 'react'

interface Format {
  itag: number
  quality: string
  container: string
  fps: number | null
  size: string | null
}

interface Props {
  videoUrl: string
  platform: string
}

export default function DownloadPanel({ videoUrl, platform }: Props) {
  const [formats, setFormats] = useState<Format[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [selectedItag, setSelectedItag] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const isYouTube = platform === 'youtube'
  const isDirectFile = platform === 'direct'

  useEffect(() => {
    setFormats([])
    setTitle('')
    setError('')
    setSelectedItag(null)
    setOpen(false)
  }, [videoUrl])

  async function fetchFormats() {
    setLoading(true)
    setError('')
    setOpen(true)
    try {
      const res = await fetch(`/api/formats?url=${encodeURIComponent(videoUrl)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFormats(data.formats)
      setTitle(data.title)
      if (data.formats.length > 0) setSelectedItag(data.formats[0].itag)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not fetch formats')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    if (!selectedItag) return
    setDownloading(true)
    try {
      const url = `/api/download?url=${encodeURIComponent(videoUrl)}&itag=${selectedItag}`
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'video'}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setTimeout(() => setDownloading(false), 2000)
    }
  }

  // For direct files — just link to the file
  if (isDirectFile) {
    return (
      <a
        href={videoUrl}
        download
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        style={{ background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.25)', color: '#00f5c4' }}
      >
        <DownloadIcon />
        Download File
      </a>
    )
  }

  // For non-YouTube platforms — show external download hint
  if (!isYouTube) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}
        title="Open original to download"
      >
        <DownloadIcon />
        Download
      </a>
    )
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      {!open && (
        <button
          onClick={fetchFormats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.25)', color: '#00f5c4' }}
        >
          {loading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : <DownloadIcon />}
          {loading ? 'Fetching...' : 'Download'}
        </button>
      )}

      {/* Format picker panel */}
      {open && (
        <div className="rounded-2xl p-5 mt-0"
          style={{ background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(0,245,196,0.15)', minWidth: '280px' }}>

          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm font-medium">Choose Quality</span>
            <button onClick={() => setOpen(false)} className="text-ghost hover:text-white transition-colors text-xs">
              ✕ Close
            </button>
          </div>

          {error && (
            <div className="rounded-lg p-3 mb-3 text-sm" style={{ background: 'rgba(255,107,53,0.1)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.2)' }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-ghost text-sm py-4 justify-center">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Loading formats...
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
                {formats.map(f => (
                  <button
                    key={f.itag}
                    onClick={() => setSelectedItag(f.itag)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left"
                    style={{
                      background: selectedItag === f.itag ? 'rgba(0,245,196,0.12)' : 'rgba(255,255,255,0.03)',
                      border: selectedItag === f.itag ? '1px solid rgba(0,245,196,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      color: selectedItag === f.itag ? '#00f5c4' : '#8888aa',
                    }}
                  >
                    <span className="font-medium">{f.quality}</span>
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      {f.fps && <span>{f.fps}fps</span>}
                      {f.size && <span>{f.size}</span>}
                      <span className="uppercase">{f.container}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleDownload}
                disabled={!selectedItag || downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: downloading ? 'rgba(0,245,196,0.2)' : '#00f5c4',
                  color: '#050508',
                }}
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Starting Download...
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Download Now
                  </>
                )}
              </button>

              {/* Movavi affiliate banner */}
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <a
                  href="https://www.movavi.com/video-editor/?utm_source=streamvault&utm_medium=banner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-all"
                  style={{ background: 'rgba(255,166,0,0.06)', border: '1px solid rgba(255,166,0,0.15)', color: '#ffa600' }}
                >
                  <span>🎬</span>
                  <div>
                    <div className="font-medium">Edit your video with Movavi</div>
                    <div className="opacity-60">Professional editor — try free</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto flex-shrink-0">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
