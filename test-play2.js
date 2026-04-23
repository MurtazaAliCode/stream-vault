const play = require('play-dl');

async function test() {
  const info = await play.video_info("https://youtu.be/HaU-cHMkCbc");
  console.log("Formats total:", info.format.length);
  
  info.format.forEach(f => {
     if (f.hasVideo && f.hasAudio) {
       console.log("Combined:", f.qualityLabel, f.container, f.url ? "URL YES" : "URL NO");
     }
  });

  const bestAudio = play.stream_from_info(info, { quality: 2 });
  // console.log("Stream:", bestAudio);
}

test();
