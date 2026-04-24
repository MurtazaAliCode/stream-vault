'use client'

import { useState, useEffect } from 'react'

export default function AdBlockDetector() {
  const [isAdBlockerActive, setIsAdBlockerActive] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Basic adblock detection by trying to fetch a common ad script URL
    const checkAdBlocker = async () => {
      const url = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      try {
        await fetch(new Request(url), { mode: 'no-cors', method: 'HEAD' })
        setIsAdBlockerActive(false)
      } catch (error) {
        setIsAdBlockerActive(true)
        // Show popup after a small delay
        setTimeout(() => setShowPopup(true), 3000)
      }
    }

    checkAdBlocker()
  }, [])

  if (!showPopup) return null

  return (
    <div className="fixed bottom-6 right-6 z-[10000] max-w-sm animate-float">
      <div className="rounded-2xl p-6 relative overflow-hidden" 
           style={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255, 107, 53, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#ff6b35] opacity-10 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3 text-[#ff6b35]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h3 className="font-bold text-sm uppercase tracking-wider">Ad-Blocker Detected</h3>
          </div>
          
          <p className="text-ghost text-xs leading-relaxed mb-4">
            We noticed you're using an ad-blocker. Please consider disabling it to help us keep StreamVault free and growing!
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPopup(false)}
              className="flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}>
              Dismiss
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
              style={{ background: '#ff6b35', color: '#fff' }}>
              I've disabled it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
