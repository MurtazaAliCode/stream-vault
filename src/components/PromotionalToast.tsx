'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  message: string
}

export default function PromotionalToast({ message }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[60] max-w-[280px]"
        >
          <div className="relative p-4 rounded-2xl border border-[#00f5c4]/20 bg-[#0a0a0f]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f5c4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-ghost hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex gap-3 items-start relative z-10">
              <div className="w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-[#00f5c4]/20 shadow-lg">
                <img src="/icon.png" alt="App Icon" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-white text-[11px] font-bold mb-1 tracking-[0.2em] uppercase opacity-80">StreamVault App</h4>
                <p className="text-ghost text-xs leading-relaxed font-light">
                  {message}
                </p>
              </div>
            </div>
            
            {/* Bottom progress bar (aesthetic) */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#00f5c4]/40 w-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
