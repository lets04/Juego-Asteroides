import { Player } from "./nave.js";
import { Bullet } from "./bullet.js";
import { Rock } from "./rock.js";
import { Explosion } from "./explosion.js";

const bullets = [];
const rocks = [];
let isGameOver = false;

let lastShot = 0;
const shootDelay = 200;

let lives = 3;
const livesElement = document.getElementById("livesValue");
let lastSpawn = 0;
const spawnDelay = 1500; // cada 1.5 segundos
const explosions = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("scoreValue");
const timeElement = document.getElementById("timeValue");

// Capturamos el color que definiste en el CSS
// En tu archivo principal, antes de crear las rocas:
const style = getComputedStyle(document.body);
const themeColor = style.getPropertyValue("--main-color").trim() || "white";

// Cuando las crees:
for (let i = 0; i < 5; i++) {
  rocks.push(new Rock(canvas.width, canvas.height, themeColor, 3));
}
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

const container = document.getElementById("game-container");

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

const player = new Player(canvas.width / 2, canvas.height / 2);

let score = 0;
let startTime = Date.now();

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }

  if (e.code === "Space") {
    keys.Space = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }

  if (e.code === "Space") {
    keys.Space = false;
  }
});
// Crear 5 rocas al empezar

gameLoop();

function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

function update() {
  // 🎮 jugador
  player.update(keys);

  // ⏱️ tiempo y score
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  timeElement.innerText = timeElapsed;
  scoreElement.innerText = score;
  livesElement.innerText = lives;

  // 🔫 BALAS
  for (let bIndex = bullets.length - 1; bIndex >= 0; bIndex--) {
    const b = bullets[bIndex];
    b.update();

    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(bIndex, 1);
    }
  }

  // 🪨 ROCAS + 💥 COLISIÓN
  for (let rIndex = rocks.length - 1; rIndex >= 0; rIndex--) {
    const rock = rocks[rIndex];
    rock.update(canvas.width, canvas.height);

    for (let bIndex = bullets.length - 1; bIndex >= 0; bIndex--) {
      const bullet = bullets[bIndex];

      const dist = Math.hypot(bullet.x - rock.x, bullet.y - rock.y);

      if (dist < rock.radius) {
        explosions.push(new Explosion(rock.x, rock.y, bullet.color));

        rocks.splice(rIndex, 1);
        bullets.splice(bIndex, 1);

        fragmentRock(rock);
        score += rock.size * 100;

        break;
      }
    }
  }

  // 🚀 COLISIÓN NAVE
  for (let i = rocks.length - 1; i >= 0; i--) {
    const rock = rocks[i];

    const dist = Math.hypot(player.x - rock.x, player.y - rock.y);

    if (dist < player.radius + rock.radius) {
      rocks.splice(i, 1);

      lives--;

      if (lives <= 0) {
        gameOver();
      } else {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
      }

      break;
    }
  }

  // 🔫 disparo
  if (keys.Space) {
    shoot();
  }

  // 💥 explosiones
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.update();

    if (e.isDone()) {
      explosions.splice(i, 1);
    }
  }
  const now = Date.now();

  if (now - lastSpawn > spawnDelay) {
    lastSpawn = now;

    const size = Math.random() > 0.5 ? 3 : 2;

    rocks.push(new Rock(canvas.width, canvas.height, themeColor, size));
  }
}

function gameOver() {
  isGameOver = true;
}

function draw() {
  player.draw(ctx);
  bullets.forEach((b) => b.draw(ctx));
  rocks.forEach((r) => r.draw(ctx));
  explosions.forEach((e) => e.draw(ctx));

  if (isGameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
}

function getRandomColor() {
  const colors = [
    "#00ffcc", // verde neon
    "#ff4d4d", // rojo
    "#ffd700", // amarillo
    "#00aaff", // azul
    "#ff00ff", // rosa
    "#ffffff", // blanco
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

function shoot() {
  const now = Date.now();
  if (now - lastShot < shootDelay) return;

  lastShot = now;

  const offset = 20;
  const angle = player.angle - Math.PI / 2;

  const bulletX = player.x + Math.cos(angle) * offset;
  const bulletY = player.y + Math.sin(angle) * offset;

  bullets.push(new Bullet(bulletX, bulletY, angle, getRandomColor()));
}

function fragmentRock(rock) {
  if (rock.size > 1) {
    for (let i = 0; i < 2; i++) {
      rocks.push(
        new Rock(
          canvas.width,
          canvas.height,
          rock.color,
          rock.size - 1,
          rock.x,
          rock.y
        )
      );
    }
  }
}