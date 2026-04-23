const { Innertube, UniversalCache } = require('youtubei.js');

async function test() {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  
  try {
    const info = await yt.getInfo('HaU-cHMkCbc');
    const formats = info.streaming_data.formats;
    const adaptive = info.streaming_data.adaptive_formats;
    
    console.log("Formats:", formats.length);
    console.log("Adaptive:", adaptive.length);
    
    // Look for combined mp4 formats
    formats.forEach(f => {
      console.log(`Combined: ${f.quality_label || f.quality} ${f.mime_type} fps: ${f.fps} size: ${f.content_length}`);
    });

  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
