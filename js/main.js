import { Player } from "./nave.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("scoreValue");
const timeElement = document.getElementById("timeValue");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(canvas.width / 2, canvas.height / 2);

let score = 0;
let startTime = Date.now();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

function update() {
    player.update();
    
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    timeElement.innerText = timeElapsed;

    scoreElement.innerText = score;
}

function draw() {
    player.draw(ctx);
}


gameLoop();