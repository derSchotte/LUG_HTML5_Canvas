// Get the canvas element from the HTML file
const canvas = document.getElementById('canvas1');

// Set the canvas width and height to the window width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the canvas context
const ctx = canvas.getContext('2d');

// GLOBAL VARIABLES
const particleArray = [];

// Mouse object
const mouse = {
    x: undefined,
    y: undefined
}

// Create a class Particle
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // this.x = mouse.x;
        // this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
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
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
}

// Event listener for mouse movement
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Event listener for resizing the canvas
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// function animate to be called each frame
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // What to do each frame
    handleParticles();
    requestAnimationFrame(animate);
}

animate();