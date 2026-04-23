const play = require('play-dl');

async function test() {
  const info = await play.video_info("https://youtu.be/HaU-cHMkCbc");
  console.log("Formats total:", info.format.length);
  
  if (info.format.length > 0) {
     console.log(info.format[0]);
  }
}

test();
