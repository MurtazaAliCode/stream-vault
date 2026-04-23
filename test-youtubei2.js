const { Innertube, UniversalCache } = require('youtubei.js');

async function test() {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  
  try {
    const info = await yt.getInfo('HaU-cHMkCbc');
    
    const targetFormat = info.streaming_data.formats.find(f => f.itag === 18);
    console.log("Format URL:", targetFormat.decipher(yt.session.player));
    
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
