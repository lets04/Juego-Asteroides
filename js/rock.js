export class Rock {
    // Añade 'color' como tercer parámetro
    constructor(canvasWidth, canvasHeight, color = "white", size = 3, x = null, y = null) {
        this.size = size;

        this.radius = (25 + Math.random() * 15) * (size / 3); // tamaño dinámico

        this.x = x ?? Math.random() * canvasWidth; //permitir spawn en punto exacto
        this.y = y ?? Math.random() * canvasHeight;

        this.vx = (Math.random() - 0.5) * (4 - size); //más pequeñas más rápidas
        this.vy = (Math.random() - 0.5) * (4 - size);

        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;

        this.totalPoints = 8 + Math.floor(Math.random() * 4);
        this.offsets = [];
        this.color = color;

        for (let i = 0; i < this.totalPoints; i++) {
            this.offsets.push(Math.random() * 12 - 6);
        }
    }

    update(w, h) {
        // Actualizar posición (Movimiento)
        this.x += this.vx;
        this.y += this.vy;

        // Actualizar ángulo (Rotación constante)
        this.angle += this.rotationSpeed;

        // Efecto "Toroide" (Wraparound): si sale, entra por el otro lado
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        for (let i = 0; i < this.totalPoints; i++) {
            const baseAngle = (i / this.totalPoints) * Math.PI * 2;
            const r = this.radius + this.offsets[i];
            const x = Math.cos(baseAngle) * r;
            const y = Math.sin(baseAngle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // CONFIGURACIÓN DE ESTILo
        ctx.strokeStyle = this.color; // Usa el color del tema
        ctx.lineWidth = 2;

        // Efecto de brillo (Glow) 
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.stroke();

        // Un relleno muy sutil para que no se vean vacías
        ctx.fillStyle = this.color + "1A"; // 10% de opacidad
        ctx.fill();

        ctx.restore();
    }
}