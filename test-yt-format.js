const { Innertube, UniversalCache } = require('youtubei.js');
const vm = require('vm');

async function test() {
  const yt = await Innertube.create({ 
     cache: new UniversalCache(false),
     evaluator: (code, env) => vm.runInNewContext(code, env)
  });
  
  try {
    const info = await yt.getInfo('HaU-cHMkCbc');
    const targetFormat = info.streaming_data.formats.find(f => f.itag === 18);
    
    const stream = await info.download({ format: targetFormat });
    
    let count = 0;
    for await (const chunk of stream) {
      count += chunk.length;
      if (count > 1000) {
        console.log("SUCCESS! Downloaded", count, "bytes using format option!");
        break;
      }
    }
  } catch (err) {
    console.log("Error:", err.message, err.stack);
  }
}

test();
