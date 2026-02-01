import { AudioSystem } from "./audio.js";
import { UI } from "./ui.js";
import { Game } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
  const audio = new AudioSystem();
  const ui = new UI(audio);
  const game = new Game(ui, audio);

  ui.onSubmit = (value) => game.handleInput(value);

  // audio button
  document.getElementById("volBtn").addEventListener("click", () => {
    audio.toggle();
    ui.setAudioLabel(audio.enabled);
    ui.powerDip();
  });

  game.start();
});