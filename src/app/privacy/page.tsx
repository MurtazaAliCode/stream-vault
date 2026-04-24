'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
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
          Privacy <span style={{ color: '#00f5c4' }}>Policy</span>
        </h1>

        <div className="space-y-8 text-ghost leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>Welcome to StreamVault. We value your privacy and are committed to protecting your personal data. This policy explains how we handle information when you use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Data We Collect</h2>
            <p>StreamVault is designed to be a private tool. We do not require user accounts. However, we may collect minimal technical data such as:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Log data (IP address, browser type) to prevent abuse.</li>
              <li>Local storage data (History is saved locally on your device, not our servers).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Information</h2>
            <p>We use the collected information only to maintain the service, ensure security, and improve user experience. We do not sell or share your data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Third-Party Services</h2>
            <p>Our service interacts with third-party platforms like YouTube, Vimeo, and others. When you use StreamVault to watch or process videos from these platforms, their respective privacy policies apply.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookies</h2>
            <p>We use minimal cookies for site functionality and analytics to understand how users interact with our tool.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p>If you have any questions about this policy, you can contact us through our official channels.</p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-ghost">
          Last updated: April 2026 · StreamVault
        </div>
      </div>
    </div>
  )
}
