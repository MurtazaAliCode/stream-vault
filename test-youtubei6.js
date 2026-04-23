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
    
    const url = targetFormat.decipher(yt.session.player);
    console.log("Deciphered URL:", url);

    const res = await fetch(url, { method: 'HEAD' });
    console.log("Response:", res.status);
    
  } catch (err) {
    console.log("Error:", err.message, err.stack);
  }
}

test();
