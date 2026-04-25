'use client'

interface Props {
  variant?: 'nordvpn' | 'movavi'
  placement?: 'inline' | 'footer'
}

export default function AffiliateBanner({ variant = 'nordvpn', placement = 'inline' }: Props) {

  if (variant === 'nordvpn') {
    return (
      <a
        href="https://vid-downloader-pro.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 w-full rounded-xl px-4 py-3 transition-all group"
        style={{
          background: 'rgba(0, 245, 196, 0.06)',
          border: '1px solid rgba(0, 245, 196, 0.18)',
        }}
      >
        {/* VidDownloader Pro icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,245,196,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold" style={{ color: '#00f5c4' }}>VidDownloader Pro — Best Downloader</div>
          <div className="text-xs text-ghost mt-0.5 truncate">Fast, secure & high-quality video downloads for free</div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-all"
          style={{ background: '#00f5c4', color: '#050508' }}>
          Visit Site
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 12-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </a>
    )
  }

  // Movavi variant
  return (
    <a
      href="https://www.mvvitrk.com/click?pid=6156&offer_id=9&sub1=streamvault"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-4 w-full rounded-xl px-4 py-3 transition-all group"
      style={{
        background: 'rgba(255, 166, 0, 0.06)',
        border: '1px solid rgba(255, 166, 0, 0.18)',
      }}
    >
      {/* Movavi icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(255,166,0,0.15)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#ffa600" opacity="0.2" />
          <polygon points="9,7 9,17 18,12" fill="#ffa600" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold" style={{ color: '#ffa600' }}>Movavi Video Editor — Official Tool</div>
        <div className="text-xs text-ghost mt-0.5 truncate">Edit, trim & enhance your videos with the official software</div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-all"
        style={{ background: '#ffa600', color: '#050508' }}>
        Get Official
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}
