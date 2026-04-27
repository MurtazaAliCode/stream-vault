'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
]

interface Props {
  current: string
  onChange: (code: any) => void
}

export default function LanguageSelector({ current, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all text-white text-xs md:text-sm font-medium shadow-2xl"
      >
        <span className="text-base md:text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline uppercase tracking-widest">{currentLang.name}</span>
        <svg 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 right-0 w-48 rounded-2xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-white/10 ${
                    current === lang.code ? 'text-[#00f5c4] bg-[#00f5c4]/5 font-bold' : 'text-ghost hover:text-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className={lang.dir === 'rtl' ? 'font-arabic' : ''}>{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
