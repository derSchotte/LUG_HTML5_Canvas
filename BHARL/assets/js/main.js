// Importieren der Player Klasse aus player.js
import {Player} from './player/player.js';

// Konstante Variablen für das Canvas und den Context
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Setzen der Canvas Größe
canvas.width = 800;
canvas.height = 480;

// Erstellen eines neuen Player Objekts 
// mit den Parametern x, y, width, height, spriteSheet, spriteSheetCols, spriteSheetRows
const player = new Player(50,50, 64,64, './assets/sprites/char_a_p1/char_a_p1_0bas_humn_v01.png', 8, 8);
player.addHat('./assets/sprites/char_a_p1/5hat/char_a_p1_5hat_pnty_v04.png', 8, 8);
player.addKleidung('./assets/sprites/char_a_p1/1out/char_a_p1_1out_pfpn_v04.png', 8, 8);
// Funktion zum Updaten des Canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.movePlayer();
    player.render(ctx);
    requestAnimationFrame(update);
}

// Aufruf der update Funktion
update();