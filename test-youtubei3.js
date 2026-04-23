const { Innertube, UniversalCache } = require('youtubei.js');

async function test() {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  
  try {
    const stream = await yt.download('HaU-cHMkCbc', {
       type: 'video+audio',
       quality: 'best',
       format: 'mp4'
    });
    
    let count = 0;
    for await (const chunk of stream) {
      count += chunk.length;
      if (count > 10000) {
        console.log("Stream is working! Read", count, "bytes");
        break;
      }
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
