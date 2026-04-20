export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.rotationSpeed = 0.05;
    this.radius = 15;
  }

  update(keys) {
    if (keys.ArrowLeft) {
      this.angle -= this.rotationSpeed;
    }
    if (keys.ArrowRight) {
      this.angle += this.rotationSpeed;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(0, -20); //punta de la nave
    ctx.lineTo(-12, 10);
    ctx.lineTo(12, 10);
    ctx.closePath();

    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.restore();
  }
}
