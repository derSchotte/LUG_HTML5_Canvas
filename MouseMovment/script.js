// Get the canvas element from the HTML file
const canvas = document.getElementById('canvas1');

// Set the canvas width and height to the window width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the canvas context
const ctx = canvas.getContext('2d');

// GLOBAL VARIABLES
const particleArray = [];
let hue = 0;

// Mouse object to store the mouse position
const mouse = {
    x: undefined,
    y: undefined
}

// Create a class Particle
class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 10 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }

    // Method to draw the particles on the canvas
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Method to update the particles position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) {
            this.size -= 0.1;
        }
    }
}

// Function to handle the particles array and draw the lines between them
function handleParticles() {
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();

        for (let j = i; j < particleArray.length; j++) {
            const dx = particleArray[i].x - particleArray[j].x;
            const dy = particleArray[i].y - particleArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Draw a line between the particles if they are close enough
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].color;
                ctx.lineWidth = 0.2;
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // Remove particles that are too small
        if(particleArray[i].size <= 0.3) {
            particleArray.splice(i, 1);
            i--;
        }
    }
}

// Event listener for mouse click to create particles at the mouse position
window.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    for (let i = 0; i < 10; i++) {
        particleArray.push(new Particle());
    }
});

// Event listener for mouse movement to create particles at the mouse position
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;

    for (let i = 0; i < 2; i++) {
        particleArray.push(new Particle());
    }
});

// Event listener for resizing the canvas when the window is resized
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// function animate to be called each frame to draw the particles on the canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // What to do each frame
    handleParticles();

    // change the hue to change the color of the particles
    hue += 5;

    requestAnimationFrame(animate);
}

// Call the animate function
animate();