import { AudioSystem } from "./audio.js";
import { UI } from "./ui.js";
import { Game } from "./game.js";

function showBootError(err){
  const term = document.getElementById("terminal");
  const status = document.getElementById("uiStatus");
  if (status) status.textContent = "BOOT ERROR — CHECK IDS / PATHS";
  if (term) {
    term.textContent =
      "BOOT ERROR:\n" +
      String(err?.message || err) +
      "\n\nMOST COMMON CAUSES:\n" +
      "- index.html IDs don't match ui.js (inputBox / terminal / volBtn)\n" +
      "- wrong script path (js/app.js)\n" +
      "- a file name mismatch (audio.js / ui.js / game.js)\n";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    const audio = new AudioSystem();
    const ui = new UI(audio);
    const game = new Game(ui, audio);

    ui.onSubmit = (value) => game.handleInput(value);

    game.start();
  } catch (e) {
    console.error(e);
    showBootError(e);
  }
});