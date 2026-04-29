export class Bullet {
  constructor(x, y, angle, color = "#00ffcc") {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 8;

    this.color = color;
    this.trail = [];
  }

  update() {
    // guardar posición anterior
    this.trail.push({ x: this.x, y: this.y });

    if (this.trail.length > 10) {
      this.trail.shift();
    }

    // movimiento
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();

    // (trazo) con degradado
    this.trail.forEach((p, i) => {
      const alpha = i / this.trail.length;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + alpha * 2, 0, Math.PI * 2);

      ctx.fillStyle = this.hexToRgba(this.color, alpha * 0.6);
      ctx.fill();
    });

    // (balita principal) (más brillante)
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);

    ctx.fillStyle = this.color;

    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;

    ctx.fill();

    // (mini línea tipo láser) (dirección)
    const tailLength = 12;
    const x2 = this.x - Math.cos(this.angle) * tailLength;
    const y2 = this.y - Math.sin(this.angle) * tailLength;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  //helper para color con transparencia
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}