// src/lib/resolver.ts
// Detects video platform from URL and returns metadata + embed info

export type Platform =
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'twitch'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'streamable'
  | 'wistia'
  | 'direct'
  | 'unknown'

export interface VideoMeta {
  platform: Platform
  originalUrl: string
  embedUrl: string
  videoId: string | null
  title: string
  thumbnail: string | null
  canEmbed: boolean
  playerType: 'iframe' | 'react-player' | 'video-tag'
}

// ─── YouTube ────────────────────────────────────────────────────────────────
function parseYouTube(url: string): VideoMeta | null {
  const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  const listId = listMatch ? listMatch[1] : null

  const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/)
  const videoId = videoMatch ? videoMatch[1] : null

  if (videoId) {
    let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    if (listId) embedUrl += `&list=${listId}`
    return {
      platform: 'youtube',
      originalUrl: url,
      embedUrl,
      videoId,
      title: listId ? 'YouTube Playlist' : 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      canEmbed: true,
      playerType: 'iframe',
    }
  } else if (listId) {
    return {
      platform: 'youtube',
      originalUrl: url,
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${listId}&rel=0&modestbranding=1`,
      videoId: listId,
      title: 'YouTube Playlist',
      thumbnail: null,
      canEmbed: true,
      playerType: 'iframe',
    }
  }
  return null
}

// ─── Vimeo ──────────────────────────────────────────────────────────────────
function parseVimeo(url: string): VideoMeta | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (match) {
    const id = match[1]
    return {
      platform: 'vimeo',
      originalUrl: url,
      embedUrl: `https://player.vimeo.com/video/${id}?color=00f5c4`,
      videoId: id,
      title: 'Vimeo Video',
      thumbnail: null,
      canEmbed: true,
      playerType: 'iframe',
    }
  }
  return null
}

// ─── Dailymotion ─────────────────────────────────────────────────────────────
function parseDailymotion(url: string): VideoMeta | null {
  const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/)
  if (match) {
    const id = match[1]
    return {
      platform: 'dailymotion',
      originalUrl: url,
      embedUrl: `https://www.dailymotion.com/embed/video/${id}`,
      videoId: id,
      title: 'Dailymotion Video',
      thumbnail: `https://www.dailymotion.com/thumbnail/video/${id}`,
      canEmbed: true,
      playerType: 'iframe',
    }
  }
  return null
}

// ─── Twitch ──────────────────────────────────────────────────────────────────
function parseTwitch(url: string): VideoMeta | null {
  const clipMatch = url.match(/twitch\.tv\/\w+\/clip\/([a-zA-Z0-9_-]+)/)
  const vodMatch = url.match(/twitch\.tv\/videos\/(\d+)/)
  const channelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)$/)

  if (clipMatch) {
    return {
      platform: 'twitch', originalUrl: url,
      embedUrl: `https://clips.twitch.tv/embed?clip=${clipMatch[1]}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`,
      videoId: clipMatch[1], title: 'Twitch Clip', thumbnail: null, canEmbed: true, playerType: 'iframe',
    }
  }
  if (vodMatch) {
    return {
      platform: 'twitch', originalUrl: url,
      embedUrl: `https://player.twitch.tv/?video=${vodMatch[1]}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`,
      videoId: vodMatch[1], title: 'Twitch VOD', thumbnail: null, canEmbed: true, playerType: 'iframe',
    }
  }
  if (channelMatch && !['directory', 'videos', 'clips', 'about'].includes(channelMatch[1])) {
    return {
      platform: 'twitch', originalUrl: url,
      embedUrl: `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`,
      videoId: channelMatch[1], title: `Twitch: ${channelMatch[1]}`, thumbnail: null, canEmbed: true, playerType: 'iframe',
    }
  }
  return null
}

// ─── Streamable ───────────────────────────────────────────────────────────────
function parseStreamable(url: string): VideoMeta | null {
  const match = url.match(/streamable\.com\/([a-zA-Z0-9]+)/)
  if (match) {
    return {
      platform: 'streamable', originalUrl: url,
      embedUrl: `https://streamable.com/e/${match[1]}`,
      videoId: match[1], title: 'Streamable Video',
      thumbnail: `https://cdn-cf-east.streamable.com/image/${match[1]}.jpg`,
      canEmbed: true, playerType: 'iframe',
    }
  }
  return null
}

// ─── Facebook ────────────────────────────────────────────────────────────────
function parseFacebook(url: string): VideoMeta | null {
  if (url.includes('facebook.com') && url.includes('/videos/')) {
    return {
      platform: 'facebook', originalUrl: url,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`,
      videoId: null, title: 'Facebook Video', thumbnail: null, canEmbed: true, playerType: 'iframe',
    }
  }
  return null
}

// ─── Direct video file (.mp4, .webm, .ogg, .mov) ─────────────────────────────
function parseDirectVideo(url: string): VideoMeta | null {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (['mp4', 'webm', 'ogg', 'mov', 'm3u8', 'mkv'].includes(ext || '')) {
    return {
      platform: 'direct', originalUrl: url,
      embedUrl: url, videoId: null,
      title: url.split('/').pop()?.split('?')[0] || 'Video',
      thumbnail: null, canEmbed: true, playerType: 'react-player',
    }
  }
  return null
}

// ─── Instagram / TikTok (limited — no direct embed support) ──────────────────
function parseSocial(url: string): VideoMeta | null {
  if (url.includes('instagram.com')) {
    const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return {
        platform: 'instagram', originalUrl: url,
        embedUrl: `https://www.instagram.com/p/${match[1]}/embed/`,
        videoId: match[1], title: 'Instagram Video',
        thumbnail: null, canEmbed: true, playerType: 'iframe',
      }
    }
  }
  if (url.includes('tiktok.com')) {
    return {
      platform: 'tiktok', originalUrl: url,
      embedUrl: url, videoId: null,
      title: 'TikTok Video', thumbnail: null,
      canEmbed: false, playerType: 'react-player',
    }
  }
  return null
}

// ─── Twitter/X ────────────────────────────────────────────────────────────────
function parseTwitter(url: string): VideoMeta | null {
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return {
      platform: 'twitter', originalUrl: url,
      embedUrl: url, videoId: null,
      title: 'Twitter/X Video', thumbnail: null,
      canEmbed: false, playerType: 'react-player',
    }
  }
  return null
}

// ─── MAIN RESOLVER ────────────────────────────────────────────────────────────
export function resolveUrl(rawUrl: string): VideoMeta {
  let url = rawUrl.trim()
  if (!url.startsWith('http')) url = 'https://' + url

  const resolvers = [
    parseYouTube,
    parseVimeo,
    parseDailymotion,
    parseTwitch,
    parseStreamable,
    parseFacebook,
    parseDirectVideo,
    parseSocial,
    parseTwitter,
  ]

  for (const resolver of resolvers) {
    const result = resolver(url)
    if (result) return result
  }

  // Unknown — try react-player as fallback
  return {
    platform: 'unknown',
    originalUrl: url,
    embedUrl: url,
    videoId: null,
    title: 'Video',
    thumbnail: null,
    canEmbed: false,
    playerType: 'react-player',
  }
}

// Platform display names + colors
export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; icon: string }> = {
  youtube:     { label: 'YouTube',     color: '#ff0000', icon: '▶' },
  vimeo:       { label: 'Vimeo',       color: '#1ab7ea', icon: '◈' },
  dailymotion: { label: 'Dailymotion', color: '#0066dc', icon: '◉' },
  twitch:      { label: 'Twitch',      color: '#9146ff', icon: '◆' },
  facebook:    { label: 'Facebook',    color: '#1877f2', icon: '◎' },
  instagram:   { label: 'Instagram',   color: '#e1306c', icon: '◈' },
  twitter:     { label: 'Twitter / X', color: '#1da1f2', icon: '◇' },
  tiktok:      { label: 'TikTok',      color: '#ff0050', icon: '◈' },
  streamable:  { label: 'Streamable',  color: '#00f5c4', icon: '▷' },
  wistia:      { label: 'Wistia',      color: '#54bbff', icon: '◈' },
  direct:      { label: 'Direct File', color: '#a78bfa', icon: '◉' },
  unknown:     { label: 'Video',       color: '#8888aa', icon: '▶' },
}
