const canvas = document.getElementById('canvas1');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

let particleArray = [];

class Particle {
    constructor() {
        // Zufellsgenerierte Position auf dem Canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Zufällige Größe
        this.size = Math.random() * 15 + 1;

        // Zufällige Geschwindigkeit
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    // Zeichnet einen Kreis
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Bewegt den Kreis
    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.speedX = -this.speedX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.speedY = -this.speedY;
        }

        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function init() {
    for (let i = 0; i < 100; i++) {
        particleArray.push(new Particle());
    }
}

init();

function handleParticles() {
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();