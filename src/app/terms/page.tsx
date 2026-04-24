'use client'

import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen grid-bg text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-ghost hover:text-white mb-12 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Terms of <span style={{ color: '#00f5c4' }}>Service</span>
        </h1>

        <div className="space-y-8 text-ghost leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using StreamVault, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Use of Service</h2>
            <p>StreamVault is a tool provided for personal, non-commercial use. You agree not to use the service for any illegal purposes or to violate any laws in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Intellectual Property</h2>
            <p>StreamVault does not host any video content. All content is accessed directly from third-party platforms. You are responsible for ensuring that your use of the content complies with the terms of service of the respective platforms and copyright laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
            <p>StreamVault is provided "as is" without any warranties. We are not liable for any damages arising from the use or inability to use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Modifications</h2>
            <p>We reserve the right to modify or discontinue the service at any time without notice. We may also update these terms from time to time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Termination</h2>
            <p>We reserve the right to block access to the service for users who violate these terms or engage in abusive behavior.</p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-ghost">
          Last updated: April 2026 · StreamVault
        </div>
      </div>
    </div>
  )
}
