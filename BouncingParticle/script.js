const canvas = document.getElementById('canvas1');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = "rgba(10, 115, 115, 1)";

const ctx = canvas.getContext('2d');

let particleArray = [];

const distanceToParticle = 50;
const maxParticleSize = 40;

let colorArray = [ 
    '#010221', 
    '#b7bf99', 
    '#edaa25', 
    '#c43302',
 ];

let mouse = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        // Zufällige Größe
        this.size = Math.random() * 15 + 1;

        /*  Zufallsgenerierte Position auf dem Canvas, 
            wobei die größe des Particle berücksichtigt wird.
            Damit diese nicht am Rand kleben bleiben. */
        this.x = this.size + Math.random() * (canvas.width - this.size * 2);
        this.y = this.size + Math.random() * (canvas.height - this.size * 2);

        /*  Zufällige Geschwindigkeit zwichen -1.5 und 1.5
            Math.random gibt eine Zahl zwischen 0 und 1 zurück.
            Mit * 3 wird die Zahl zwischen 0 und 3.
            Mit -1.5 wird die Zahl auf -1.5 und 1.5 verschoben. */
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    // Zeichnet einen Kreis und füllt ihn mit weißer Farbe
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Bewegt den Kreis auf dem Canvas und lässt ihn abprallen wenn er den Rand berührt
    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.speedX = -this.speedX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.speedY = -this.speedY;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Interaktion mit der Maus
        if(mouse.x - this.x < distanceToParticle && 
            mouse.x - this.x > -distanceToParticle && 
            mouse.y - this.y < distanceToParticle && 
            mouse.y - this.y > -distanceToParticle) {
            if(this.size < maxParticleSize) {
                this.size += 1;
            } 

            console.log(this.size);
        }else if(this.size > 8) {
            this.size -= 1;
        }
    }
}

// Erstellt 100 Particles und speichert sie in einem Array
function init() {
    for (let i = 0; i < 100; i++) {
        particleArray.push(new Particle());
    }
}

// Ruft die Funktion init auf
init();

/*  Zeichnet alle Particles auf dem Canvas "particleArray[i].draw()" 
    und bewegt sie anschließend "particleArray[i].draw()". */
function handleParticles() {
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
}

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Animiert die Particles auf dem Canvas und ruft sich selbst wieder auf (rekursiv)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

// Ruft die Funktion animate auf
animate();