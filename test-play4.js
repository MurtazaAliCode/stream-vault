const play = require('play-dl');

async function test() {
  try {
    const stream = await play.stream("https://youtu.be/HaU-cHMkCbc", { quality: 18 });
    console.log("Stream Type:", stream.type);
    console.log("Stream Url:", stream.url);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
