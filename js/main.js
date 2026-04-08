import { Player } from "./nave.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(canvas.width / 2, canvas.height / 2);

function gameLoop() {
  update();
  draw();
}

function update() {
  player.update();
}

function draw() {
  player.draw(ctx);
}

gameLoop();