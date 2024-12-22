const audio = new Audio();

export function playSound(file) {
  audio.src = `./assets/${file}.mp3`;
  audio.play();
}
