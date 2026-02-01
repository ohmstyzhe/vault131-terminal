import { AudioSystem } from "./audio.js";
import { UI } from "./ui.js";
import { Game } from "./game.js";

const audio = new AudioSystem();
const ui = new UI(audio);
const game = new Game(ui, audio);

game.start();