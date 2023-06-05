import {Player} from './player/player.js';

const canvas = document.getElementById('canvas1');

const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 480;

const player = new Player(50, 50, 32, 32);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.movePlayer();
    player.render(ctx);
    requestAnimationFrame(update);
}

update();