import { Player as Jugador } from "./nave.js";
import { Bullet as Bala } from "./bullet.js";
import { Rock as Roca } from "./rock.js";
import { Explosion as Explosion } from "./explosion.js";

const balas = [];
const rocas = [];
let juegoTerminado = false;

let ultimoDisparo = 0;
const retrasoDisparo = 200;

let nombreJugador = "Jugador";

let vidas = 3;
const elementoVidas = document.getElementById("livesValue");
let ultimaAparicionRoca = 0;
const SegRocas = 5000; // Intervalo de aparición
const explosiones = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const elementoPuntaje = document.getElementById("scoreValue");
const elementoTiempo = document.getElementById("timeValue");

// Color del tema desde CSS
const estilo = getComputedStyle(document.body);
const colorTema = estilo.getPropertyValue("--main-color").trim() || "white";

const pantallaInicio = document.getElementById("start-screen");
const botonInicio = document.getElementById("startBtn");
const entradaNombre = document.getElementById("playerNameInput");
const interfazNombre = document.getElementById("playerNameUI");

const pantallaFinJuego = document.getElementById("game-over-screen");
const botonReiniciar = document.getElementById("restartBtn");
const puntajeFinal = document.getElementById("finalScore");

botonReiniciar.addEventListener("click", () => {
  reiniciarJuego();
});

// Crear rocas iniciales
for (let i = 0; i < 5; i++) {
  rocas.push(new Roca(canvas.width, canvas.height, colorTema, 3));
}

const teclas = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  Space: false,
};

const contenedor = document.getElementById("game-container");

canvas.width = contenedor.clientWidth;
canvas.height = contenedor.clientHeight;

const jugador = new Jugador(canvas.width / 2, canvas.height / 2);

let puntaje = 0;
let tiempoInicio = Date.now();

window.addEventListener("keydown", (e) => {
  if (teclas.hasOwnProperty(e.key)) {
    teclas[e.key] = true;
  }
  if (e.code === "Space") {
    teclas.Space = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (teclas.hasOwnProperty(e.key)) {
    teclas[e.key] = false;
  }
  if (e.code === "Space") {
    teclas.Space = false;
  }
});

let juegoIniciado = false;
botonInicio.addEventListener("click", () => {
  const nombre = entradaNombre.value.trim();

  if (nombre !== "") {
    nombreJugador = nombre;
  }

  pantallaInicio.style.display = "none";
  iniciarJuego();
});

function iniciarJuego() {
  interfazNombre.innerText = nombreJugador;
  juegoIniciado = true;
  tiempoInicio = Date.now();
  bucleJuego();
}

function bucleJuego() {
  if (!juegoIniciado || juegoTerminado) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  actualizar();
  dibujar();

  requestAnimationFrame(bucleJuego);
}

function actualizar() {
  // Jugador
  jugador.update(teclas, canvas);

  // Tiempo, puntaje y vidas
  const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
  elementoTiempo.innerText = tiempoTranscurrido;
  elementoPuntaje.innerText = puntaje;
  elementoVidas.innerText = vidas;

  // BALAS
  for (let i = balas.length - 1; i >= 0; i--) {
    const b = balas[i];
    b.update();

    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      balas.splice(i, 1);
    }
  }

  // ROCAS + COLISIÓN CON BALAS
  for (let i = rocas.length - 1; i >= 0; i--) {
    const roca = rocas[i];
    roca.update(canvas.width, canvas.height);

    for (let j = balas.length - 1; j >= 0; j--) {
      const bala = balas[j];
      const distancia = Math.hypot(bala.x - roca.x, bala.y - roca.y);

      if (distancia < roca.radius) {
        explosiones.push(new Explosion(roca.x, roca.y, bala.color));

        rocas.splice(i, 1);
        balas.splice(j, 1);

        fragmentarRoca(roca);
        puntaje += roca.size * 100;
        break;
      }
    }
  }

  // COLISIÓN ROCA CON NAVE
  for (let i = rocas.length - 1; i >= 0; i--) {
    const roca = rocas[i];
    const distancia = Math.hypot(jugador.x - roca.x, jugador.y - roca.y);

    if (distancia < jugador.radius + roca.radius) {
      rocas.splice(i, 1);
      vidas--;

      contenedor.classList.add("damage");
      setTimeout(() => {
        contenedor.classList.remove("damage");
      }, 500);

      if (vidas <= 0) {
        finDelJuego();
      } else {
        jugador.x = canvas.width / 2;
        jugador.y = canvas.height / 2;
      }
      break;
    }
  }

  // Disparo
  if (teclas.Space) {
    disparar();
  }

  // Explosiones
  for (let i = explosiones.length - 1; i >= 0; i--) {
    const exp = explosiones[i];
    exp.update();

    if (exp.isDone()) {
      explosiones.splice(i, 1);
    }
  }

  // Aparición de nuevas rocas
  const ahora = Date.now();
  if (ahora - ultimaAparicionRoca > SegRocas) {
    ultimaAparicionRoca = ahora;
    const tamano = Math.random() > 0.5 ? 3 : 2;
    rocas.push(new Roca(canvas.width, canvas.height, colorTema, tamano));
  }
}

function finDelJuego() {
  juegoTerminado = true;
  puntajeFinal.innerText = `${nombreJugador}, tu puntaje fue: ${puntaje}`;
  pantallaFinJuego.style.display = "flex";
}

function reiniciarJuego() {
  vidas = 3;
  puntaje = 0;
  rocas.length = 0;
  balas.length = 0;
  explosiones.length = 0;

  juegoTerminado = false;
  juegoIniciado = true;

  jugador.x = canvas.width / 2;
  jugador.y = canvas.height / 2;

  tiempoInicio = Date.now();
  pantallaFinJuego.style.display = "none";

  for (let i = 0; i < 5; i++) {
    rocas.push(new Roca(canvas.width, canvas.height, colorTema, 3));
  }

  bucleJuego();
}

function dibujar() {
  jugador.draw(ctx);
  balas.forEach((b) => b.draw(ctx));
  rocas.forEach((r) => r.draw(ctx));
  explosiones.forEach((e) => e.draw(ctx));
}

function obtenerColorAleatorio() {
  const colores = ["#00ffcc", "#ff4d4d", "#ffd700", "#00aaff", "#ff00ff", "#ffffff"];
  return colores[Math.floor(Math.random() * colores.length)];
}

function disparar() {
  const ahora = Date.now();
  if (ahora - ultimoDisparo < retrasoDisparo) return;

  ultimoDisparo = ahora;

  const distanciaBala = 20;
  const angulo = jugador.angle - Math.PI / 2;

  const balaX = jugador.x + Math.cos(angulo) * distanciaBala;
  const balaY = jugador.y + Math.sin(angulo) * distanciaBala;

  balas.push(new Bala(balaX, balaY, angulo, obtenerColorAleatorio()));
}

function fragmentarRoca(roca) {
  if (roca.size > 1) {
    for (let i = 0; i < 2; i++) {
      rocas.push(
        new Roca(
          canvas.width,
          canvas.height,
          roca.color,
          roca.size - 1,
          roca.x,
          roca.y
        )
      );
    }
  }
}