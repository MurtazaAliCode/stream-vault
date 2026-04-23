'use client'

import { VideoMeta, PLATFORM_CONFIG } from '@/lib/resolver'

interface Props {
  history: VideoMeta[]
  onSelect: (meta: VideoMeta) => void
  onClose: () => void
  onClear: () => void
}

export default function HistoryPanel({ history, onSelect, onClose, onClear }: Props) {
  if (history.length === 0) return null

  return (
    <div className="rounded-2xl mb-6 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-white text-sm font-medium flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="2">
            <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
          </svg>
          Watch History
        </span>
        <div className="flex items-center gap-2">
          <button onClick={onClear}
            className="text-xs px-3 py-1 rounded-lg transition-all"
            style={{ color: '#ff6b35', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}>
            Clear
          </button>
          <button onClick={onClose}
            className="text-ghost hover:text-white transition-colors p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {history.map((item, i) => {
          const config = PLATFORM_CONFIG[item.platform]
          return (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="history-item w-full flex items-center gap-3 px-5 py-3 text-left"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

              {/* Platform dot */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: `${config.color}15`, border: `1px solid ${config.color}30`, color: config.color }}>
                {config.icon}
              </div>

              {/* URL */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium mb-0.5" style={{ color: config.color }}>
                  {config.label}
                </p>
                <p className="text-ghost text-xs truncate">{item.originalUrl}</p>
              </div>

              {/* Arrow */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333350" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}
