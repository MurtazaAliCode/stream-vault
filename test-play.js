const play = require('play-dl');

async function test() {
  try {
    const info = await play.video_info("https://youtu.be/HaU-cHMkCbc");
    console.log("Formats total:", info.format.length);
    const combined = info.format.filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4');
    console.log("Combined:", combined.length);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
