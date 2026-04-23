const ytdl = require('@distube/ytdl-core');

async function test() {
  try {
    const info = await ytdl.getInfo("https://youtu.be/HaU-cHMkCbc");
    console.log("Formats total:", info.formats.length);
    const combined = info.formats.filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4');
    console.log("Combined MP4:", combined.length);
  } catch (err) {
    console.error("ERROR CAUGHT:", err.message);
  }
}

test();
