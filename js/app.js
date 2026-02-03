import { AudioSystem } from "./audio.js";
import { UI } from "./ui.js";
import { Game } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
  const audio = new AudioSystem();
  const ui = new UI(audio);
  const game = new Game(ui, audio);

  ui.onSubmit = (value) => game.handleInput(value);

  game.start(); // ALWAYS starts at the ID prompt

// CRT mask reacts to terminal scroll (safe + tiny)
const term = document.getElementById('terminal');
const crt = document.getElementById('crt');

if (term && crt) {
  // initialize
  crt.style.setProperty('--maskScroll', '0px');

  term.addEventListener('scroll', () => {
    crt.style.setProperty('--maskScroll', `${term.scrollTop}px`);
  }, { passive: true });
}
});