'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate sending
    setTimeout(() => setStatus('success'), 1500)
  }

  return (
    <div className="min-h-screen grid-bg text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-ghost hover:text-white mb-12 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Get in <span style={{ color: '#00f5c4' }}>Touch</span>
        </h1>
        <p className="text-ghost mb-12">Have a question or feedback? We'd love to hear from you.</p>

        {status === 'success' ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(0,245,196,0.05)', border: '1px solid rgba(0,245,196,0.2)' }}>
            <div className="w-16 h-16 bg-[#00f5c4]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f5c4" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-ghost text-sm">Thank you for contacting us. We'll get back to you soon.</p>
            <button onClick={() => setStatus('idle')} className="mt-8 text-[#00f5c4] text-xs font-bold uppercase tracking-widest">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ghost ml-1">Name</label>
                <input required type="text" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#00f5c4] focus:outline-none transition-all" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ghost ml-1">Email</label>
                <input required type="email" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#00f5c4] focus:outline-none transition-all" placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ghost ml-1">Message</label>
              <textarea required rows={5} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#00f5c4] focus:outline-none transition-all resize-none" placeholder="How can we help?" />
            </div>

            <button 
              disabled={status === 'sending'}
              className="w-full h-14 rounded-xl font-bold uppercase tracking-widest transition-all relative overflow-hidden group"
              style={{ background: '#00f5c4', color: '#050508' }}>
              <span className="relative z-10">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </form>
        )}

        <div className="mt-16 flex items-center justify-center gap-12 text-ghost opacity-50">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">Email</span>
            <span className="text-sm font-medium">support@streamvault.com</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">Office</span>
            <span className="text-sm font-medium">Global Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}
