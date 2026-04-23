# StreamVault — Universal Video Player

> Paste any video link. Watch instantly. No ads. No redirects.

A premium Next.js web app that plays videos from any platform — YouTube, Vimeo, Twitch, Dailymotion, Streamable, Facebook, direct MP4 files, and more.

---

## Features

- **Universal URL detection** — auto detects 10+ platforms
- **Clean fullscreen player** — no ads, no distractions
- **Watch History** — last 20 links saved locally
- **Custom cursor** — premium feel
- **Dark cyberpunk UI** — unique, memorable design
- **Mobile responsive** — works on all devices
- **Zero backend** — no server costs

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Supported Platforms

| Platform | Type | Status |
|---|---|---|
| YouTube | Iframe embed | ✅ Full support |
| Vimeo | Iframe embed | ✅ Full support |
| Twitch (live + VOD + clips) | Iframe embed | ✅ Full support |
| Dailymotion | Iframe embed | ✅ Full support |
| Streamable | Iframe embed | ✅ Full support |
| Facebook Videos | Iframe embed | ✅ Full support |
| Direct MP4/WebM/OGG | React Player | ✅ Full support |
| Instagram Reels | Iframe embed | ⚠️ Limited |
| Twitter/X Videos | React Player | ⚠️ Limited |
| TikTok | React Player | ⚠️ Limited |

---

## Project Structure

```
streamvault/
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Root layout + fonts
│   │   ├── page.tsx        ← Main page (URL input + player)
│   │   └── globals.css     ← Custom styles + animations
│   ├── components/
│   │   ├── VideoPlayer.tsx ← Smart player component
│   │   ├── HistoryPanel.tsx← Watch history sidebar
│   │   └── CustomCursor.tsx← Animated cursor
│   └── lib/
│       └── resolver.ts     ← URL parser + platform detector
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Deployment (Free)

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
→ Live in 60 seconds. Free hosting.

### Netlify
```bash
npm run build
# Upload .next/out folder
```

---

## How to Sell This ($4000+)

### Option 1 — Sell as a SaaS ($29–49/month)
- Add user auth (NextAuth.js)
- Playlists feature
- Custom domain support
- Sell on AppSumo or your own landing page

### Option 2 — Sell source code on Gumroad ($297–497 one-time)
- "Universal Video Player — Next.js Source Code"
- Target: developers, agencies, startups
- Post on: Gumroad, Envato Market, CodeCanyon

### Option 3 — White-label to clients ($1000–4000)
- "Video platform for your business"
- Custom branding + domain
- Sell to media companies, education platforms, Telegram channel owners

### Option 4 — Add to Telegram bot ($500–2000)
- Bot receives link
- Replies with streamvault.yoursite.com/?url=LINK
- Monetize with ads or subscription

### Target buyers:
- Telegram channel admins (millions of them)
- Educators sharing video content
- Small media companies
- Content aggregator apps

---

## Adding More Platforms

Edit `src/lib/resolver.ts` and add a new parser function:

```typescript
function parseNewPlatform(url: string): VideoMeta | null {
  const match = url.match(/yourplatform\.com\/video\/([a-zA-Z0-9]+)/)
  if (match) {
    return {
      platform: 'unknown',
      originalUrl: url,
      embedUrl: `https://yourplatform.com/embed/${match[1]}`,
      videoId: match[1],
      title: 'Platform Video',
      thumbnail: null,
      canEmbed: true,
      playerType: 'iframe',
    }
  }
  return null
}
```

Then add it to the `resolvers` array in `resolveUrl()`.
