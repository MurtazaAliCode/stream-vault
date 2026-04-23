'use client'

interface Props {
  variant?: 'nordvpn' | 'movavi'
  placement?: 'inline' | 'footer'
}

export default function AffiliateBanner({ variant = 'nordvpn', placement = 'inline' }: Props) {

  if (variant === 'nordvpn') {
    return (
      <a
        href="https://nordvpn.com/?utm_source=streamvault&utm_medium=banner&utm_campaign=video_player"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center gap-4 w-full rounded-xl px-4 py-3 transition-all group"
        style={{
          background: 'rgba(62, 100, 255, 0.06)',
          border: '1px solid rgba(62, 100, 255, 0.18)',
        }}
      >
        {/* NordVPN icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(62,100,255,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#3e64ff" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold" style={{ color: '#3e64ff' }}>NordVPN — Stay Private Online</div>
          <div className="text-xs text-ghost mt-0.5 truncate">Stream securely from anywhere · Up to 69% off</div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-all"
          style={{ background: '#3e64ff', color: '#fff' }}>
          Get Deal
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </a>
    )
  }

  // Movavi variant
  return (
    <a
      href="https://www.movavi.com/video-editor/?utm_source=streamvault&utm_medium=banner&utm_campaign=post_download"
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
        <div className="text-xs font-semibold" style={{ color: '#ffa600' }}>Movavi Video Editor</div>
        <div className="text-xs text-ghost mt-0.5 truncate">Edit, trim & enhance your downloaded videos</div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-all"
        style={{ background: '#ffa600', color: '#050508' }}>
        Try Free
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}
