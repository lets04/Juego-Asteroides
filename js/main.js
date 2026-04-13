import { Player } from "./nave.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("scoreValue");
const timeElement = document.getElementById("timeValue");

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(canvas.width / 2, canvas.height / 2);

let score = 0;
let startTime = Date.now();

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

function update() {
  player.update(keys);

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  timeElement.innerText = timeElapsed;

  scoreElement.innerText = score;
}

function draw() {
  player.draw(ctx);
}

gameLoop();
