export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.angle = 0;
    this.rotationSpeed = 0.07;

    this.radius = 15;

    this.speed = 0;
    this.acceleration = 0.1;
    this.friction = 0.98;

    this.velocityX = 0;
    this.velocityY = 0;
  }

  update(keys, canvas) {
    // rotación
    if (keys.ArrowLeft) {
      this.angle -= this.rotationSpeed;
    }
    if (keys.ArrowRight) {
      this.angle += this.rotationSpeed;
    }

    //  avanzar
    if (keys.ArrowUp) {
      this.velocityX += Math.cos(this.angle - Math.PI / 2) * this.acceleration;
      this.velocityY += Math.sin(this.angle - Math.PI / 2) * this.acceleration;
    }

    //fricción
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;

    //mover
    this.x += this.velocityX;
    this.y += this.velocityY;

    // wrap
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-12, 10);
    ctx.lineTo(12, 10);
    ctx.closePath();

    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.restore();
  }
}