import { Player } from "./nave.js";
import { Bullet } from "./bullet.js";
import { Rock } from "./rock.js";

const bullets = [];
const rocks = [];

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

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    shoot();
  }
});
// Crear 5 rocas al empezar
for (let i = 0; i < 5; i++) {
  rocks.push(new Rock(canvas.width, canvas.height));
}

gameLoop();

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

  // Actualizar Balas
  bullets.forEach((b, bIndex) => {
    b.update();
    
    // Opcional: Eliminar balas que salen de la pantalla para optimizar
    if(b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
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
        // Eliminar ambos objetos
        rocks.splice(rIndex, 1);
        bullets.splice(bIndex, 1);
        
        // Aumentar puntaje
        score += 100;

        // Crear una nueva roca después de un tiempo para que no se acaben
        setTimeout(() => {
            rocks.push(new Rock(canvas.width, canvas.height));
        }, 1000);
      }
    });
  });
}

function draw() {
  player.draw(ctx);
  bullets.forEach((b) => b.draw(ctx));
  rocks.forEach((r) => r.draw(ctx)); // <--- Dibujar rocas
}

gameLoop();

function shoot() {
  const offset = 20;

  const angle = player.angle - Math.PI / 2;

  const bulletX = player.x + Math.cos(angle) * offset;
  const bulletY = player.y + Math.sin(angle) * offset;

  bullets.push(new Bullet(bulletX, bulletY, angle));
}