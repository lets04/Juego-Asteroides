export class Player {
    
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
  }

  update() {
    
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 10, this.y + 20);
    ctx.lineTo(this.x + 10, this.y + 20);
    //ctx.moveTo(80, 70);
    //ctx.lineTo(90, 80);
    //ctx.lineTo(70, 80);
    //ctx.lineTo(80, 70);
    ctx.strokeStyle = "white";
    ctx.closePath();
    ctx.stroke();
  }
}
