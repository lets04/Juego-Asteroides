
export class Rock {
    constructor(canvasWidth, canvasHeight) {
      // Posición aleatoria
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      
      // Velocidad y dirección aleatoria
      this.vx = (Math.random() - 0.5) * 4; 
      this.vy = (Math.random() - 0.5) * 4;
      
      this.radius = 20 + Math.random() * 20; // Tamaño variado
    }
  
    update(canvasWidth, canvasHeight) {
      this.x += this.vx;
      this.y += this.vy;
  
      // Efecto "Toroide" (si sale por un lado, entra por el otro)
      if (this.x < 0) this.x = canvasWidth;
      if (this.x > canvasWidth) this.x = 0;
      if (this.y < 0) this.y = canvasHeight;
      if (this.y > canvasHeight) this.y = 0;
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.closePath();
    }
  }