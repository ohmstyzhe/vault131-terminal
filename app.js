import { AudioSystem } from "./js/audio.js";
import { UI } from "./js/ui.js";
import { Game } from "./js/game.js";

window.addEventListener("DOMContentLoaded", () => {
  const audio = new AudioSystem();
  const ui = new UI(audio);
  const game = new Game(ui, audio);

  ui.onSubmit = (value) => game.handleInput(value);
  game.start();
});