import { NextRequest, NextResponse } from 'next/server'
import { Innertube, UniversalCache } from 'youtubei.js'
import vm from 'vm'

let yt: Innertube | null = null;
async function getYt() {
  if (!yt) {
    yt = await Innertube.create({ 
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
  }
  return yt;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try {
    const videoIdMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) || url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) throw new Error("Invalid YouTube URL");

    const ytApi = await getYt()
    const info = await ytApi.getInfo(videoId)
    
    const title = info.basic_info.title
    const thumbnail = info.basic_info.thumbnail?.[0]?.url || null

    type VideoFormat = { itag: number; quality_label?: string; quality?: string; mime_type: string; fps?: number; content_length?: string; bitrate?: number; };
    const formats: Record<string, unknown>[] = []
    
    // Combined formats
    if (info.streaming_data?.formats) {
      info.streaming_data.formats.forEach((f: any) => {
         formats.push({
           itag: f.itag,
           quality: f.quality_label || f.quality || '360p',
           container: f.mime_type.split(';')[0].replace('video/', ''),
           fps: f.fps || 30,
           size: f.content_length ? Math.round(Number(f.content_length) / 1024 / 1024) + ' MB' : null
         })
      })
    }

    // High Quality Video Only
    if (info.streaming_data?.adaptive_formats) {
       const videos = info.streaming_data.adaptive_formats.filter((f: any) => f.mime_type.startsWith('video/mp4'));
       videos.forEach((f: any) => {
         if (!formats.find(ex => (ex as any).quality === f.quality_label || (ex as any).quality === `${f.quality_label} (Video Only)`)) {
            formats.push({
              itag: f.itag,
              quality: (f.quality_label || f.quality || '720p') + ' (Video Only)',
              container: 'mp4',
              fps: f.fps || 30,
              size: f.content_length ? Math.round(Number(f.content_length) / 1024 / 1024) + ' MB' : null
            })
         }
       })
    }

    // Audio only
    if (info.streaming_data?.adaptive_formats) {
       const audioFormats = info.streaming_data.adaptive_formats.filter((f: any) => f.mime_type.startsWith('audio/'));
       if (audioFormats.length > 0) {
          const a = audioFormats.sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0];
          formats.push({
             itag: a.itag,
             quality: `Audio Only (${Math.round((a.bitrate||0)/1000)}kbps)`,
             container: a.mime_type.split(';')[0].replace('audio/', ''),
             fps: null,
             size: a.content_length ? Math.round(Number(a.content_length) / 1024 / 1024) + ' MB' : null
          })
       }
    }

    formats.sort((a, b) => {
       const order = ['2160p (Video Only)', '1440p (Video Only)', '1080p (Video Only)', '1080p', '720p (Video Only)', '720p', '480p', '360p'];
       const indexA = order.indexOf((a as any).quality as string);
       const indexB = order.indexOf((b as any).quality as string);
       if (indexA === -1 && indexB === -1) return 0;
       if (indexA === -1) return 1;
       if (indexB === -1) return -1;
       return indexA - indexB;
    });

    if (formats.length === 0) throw new Error("No formats found");

    return NextResponse.json({ title, thumbnail, formats })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch formats'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

