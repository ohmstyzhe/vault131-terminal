// app.js (tiny bootstrapper)
import { AudioSystem } from "./modules/audio.js";
import { UI } from "./modules/ui.js";
import { Game } from "./modules/game.js";

const audio = new AudioSystem();
const ui = new UI(audio);
const game = new Game(ui, audio);

game.start();