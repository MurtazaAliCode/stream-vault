import { NextRequest, NextResponse } from 'next/server'
import { Innertube, UniversalCache } from 'youtubei.js'
import vm from 'vm'

let yt: Innertube | null = null;
async function getYt() {
  if (!yt) {
    yt = await Innertube.create({ 
      cache: new UniversalCache(false),
      fetch_visitor_data: false,
      generate_session_locally: true,
      evaluator: (code: string, env: any) => {
        return vm.runInNewContext(code, env);
      }
    });
  }
  return yt;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  const itag = req.nextUrl.searchParams.get('itag')

  if (!url || !itag) {
    return NextResponse.json({ error: 'url and itag are required' }, { status: 400 })
  }

  try {
    const videoIdMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) || url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) throw new Error("Invalid YouTube URL");

    const ytApi = await getYt()
    const info = await ytApi.getInfo(videoId)
    
    let targetFormat = info.streaming_data?.formats?.find((f: any) => f.itag === Number(itag));
    if (!targetFormat) {
       targetFormat = info.streaming_data?.adaptive_formats?.find((f: any) => f.itag === Number(itag));
    }
    if (!targetFormat) throw new Error("Format not found");

    const title = info.basic_info.title?.replace(/[^\w\s-]/g, '').trim() || 'video'
    const filename = `${title}.mp4`

    const stream = await ytApi.download(videoId, {
       type: targetFormat.has_video && targetFormat.has_audio ? 'video+audio' : (targetFormat.has_video ? 'video' : 'audio'),
       quality: 'best',
       format: 'mp4',
       client: 'WEB'
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
             controller.enqueue(chunk);
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Download failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
