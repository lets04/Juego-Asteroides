export class Explosion {
  constructor(x, y, color) {
    this.particles = [];

    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 30,
        color,
      });
    }
  }

  update() {
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    this.particles = this.particles.filter((p) => p.life > 0);
  }

  draw(ctx) {
    this.particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;

      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  isDone() {
    return this.particles.length === 0;
  }
}