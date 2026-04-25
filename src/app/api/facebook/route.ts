import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try {
    // Fetch the Facebook page as a browser would
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Facebook returned ${res.status}` }, { status: 502 })
    }

    const html = await res.text()

    // ── Extract video URL from various Facebook page formats ──────────────────

    // 1. og:video meta tag (most reliable for public videos)
    const ogVideoMatch = html.match(/<meta\s+property="og:video(?::url)?"\s+content="([^"]+)"/) ||
                         html.match(/<meta\s+content="([^"]+)"\s+property="og:video(?::url)?"/)
    const ogVideoUrl = ogVideoMatch ? ogVideoMatch[1].replace(/&amp;/g, '&') : null

    // 2. og:image for thumbnail
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/) ||
                         html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/)
    const thumbnail = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, '&') : null

    // 3. og:title
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/) ||
                         html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/)
    const title = ogTitleMatch ? ogTitleMatch[1].replace(/&amp;/g, '&') : 'Facebook Video'

    // 4. Try to find HD video URL in page source (JSON data)
    const hdUrlMatch = html.match(/"hd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/) ||
                       html.match(/"playable_url_quality_hd"\s*:\s*"([^"]+)"/)
    const hdUrl = hdUrlMatch ? hdUrlMatch[1].replace(/\\/g, '') : null

    // 5. SD video URL fallback
    const sdUrlMatch = html.match(/"sd_src(?:_no_ratelimit)?"\s*:\s*"([^"]+)"/) ||
                       html.match(/"playable_url"\s*:\s*"([^"]+)"/)
    const sdUrl = sdUrlMatch ? sdUrlMatch[1].replace(/\\/g, '') : null

    const videoUrl = hdUrl || sdUrl || ogVideoUrl

    if (!videoUrl) {
      // Check if it's a login-required page
      if (html.includes('login') && html.includes('You must log in')) {
        return NextResponse.json({
          error: 'login_required',
          message: 'This video is private or requires Facebook login to view.',
        }, { status: 403 })
      }
      return NextResponse.json({
        error: 'not_found',
        message: 'Could not extract video from this Facebook URL. The video may be private or friends-only.',
      }, { status: 404 })
    }

    return NextResponse.json({
      videoUrl,
      title,
      thumbnail,
      quality: hdUrl ? 'HD' : (sdUrl ? 'SD' : 'Standard'),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch Facebook video'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
