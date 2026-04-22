import { Player } from "./nave.js";
import { Bullet } from "./bullet.js";
import { Rock } from "./rock.js";

const bullets = [];
const rocks = [];
let isGameOver = false;

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
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    shoot(); //dispara
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
  player.update(keys);

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  timeElement.innerText = timeElapsed;
  scoreElement.innerText = score;
  // Actualizar Balas
  bullets.forEach((b, bIndex) => {
    b.update();

    // Eliminar balas que salen de la pantalla para optimizar
    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(bIndex, 1);
    }
  });

  // Actualizar Rocas y detectar colisiones
  rocks.forEach((rock, rIndex) => {
    rock.update(canvas.width, canvas.height);

    // Colisión Bala vs Roca
    bullets.forEach((bullet, bIndex) => {
      const dist = Math.hypot(bullet.x - rock.x, bullet.y - rock.y);

      // Si la distancia es menor al radio de la roca (aprox 20)
      if (dist < rock.radius) {
        const destroyedRock = rock;

        rocks.splice(rIndex, 1);
        bullets.splice(bIndex, 1);

        // 💥 fragmentar
        fragmentRock(destroyedRock);

        // 🎯 puntaje según tamaño
        score += destroyedRock.size * 100;
      }
    });
  });
  //Colisión Nave vs Roca
  rocks.forEach((rock) => {
    const dist = Math.hypot(player.x - rock.x, player.y - rock.y);

    if (dist < player.radius + rock.radius) {
      gameOver();
    }
  });
}

function gameOver() {
  isGameOver = true;
  setTimeout(() => {
    alert("Game Over");
    location.reload();
  }, 100);
}

function draw() {
  player.draw(ctx);
  bullets.forEach((b) => b.draw(ctx));
  rocks.forEach((r) => r.draw(ctx)); // Dibujar rocas
}
function shoot() {
  const offset = 20;

  const angle = player.angle - Math.PI / 2;
  //posición de la punta de la nave
  const bulletX = player.x + Math.cos(angle) * offset;
  const bulletY = player.y + Math.sin(angle) * offset;
  // bala con posición y dirección
  bullets.push(new Bullet(bulletX, bulletY, angle));
}

function fragmentRock(rock) {
  if (rock.size > 1) {
    for (let i = 0; i < 2; i++) {
      rocks.push(
        new Rock(
          canvas.width,
          canvas.height,
          rock.color,
          rock.size - 1, // 👈 más pequeña
          rock.x,
          rock.y
        )
      );
    }
  }
}