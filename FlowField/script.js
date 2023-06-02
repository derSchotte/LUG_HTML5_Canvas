// Get the canvas element from the HTML file
const canvas = document.getElementById('canvas1');

// Set the canvas width and height to the window width and height
canvas.width = 600;
canvas.height = 600;

// Get the canvas context
const ctx = canvas.getContext('2d');

// GLOBAL VARIABLES


// Create a class Particle
class Particle {
    constructor(effect) {
        this.effect = effect;
        //  Set the x and y position of the particle to a random position within the canvas
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 3 + 1);
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 10 + 5);
        this.angle = 0;
        this.newAngle = 0;
        this.angleCorrector = Math.random() * 0.5 - 0.01;
        this.timer = this.maxLength * 2;
        this.colors = ['#DB005B', '#F79327', '#FFE569'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);

        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }

        context.strokeStyle = this.color;
        // context.lineWidth = 3;
        context.stroke();
    }

    update() {
        this.timer--;

        if(this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = x + y * this.effect.cols;

            if(this.effect.flowField[index]) {
                this.angle = this.effect.flowField[index].colorAngle;

                if(this.angle > this.newAngle) {
                    this.angle -= this.angleCorrector;
                } else if(this.angle < this.newAngle) {
                    this.angle += this.angleCorrector;
                } else {
                    this.angle = this.newAngle;
                }
            }

            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);

            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;

            this.history.push({x: this.x, y: this.y});

            if(this.history.length > this.maxLength) {
                this.history.shift();
            }
        } else if(this.history.length > 1) {
            this.history.shift();
        } else {
            this.reset();
        }
    }

    reset() {
        let attempts = 0;
        let resetSuccessful = false;

        while(attempts < 10 && !resetSuccessful) {
            attempts++;

            let testIndex = Math.floor(Math.random() * this.effect.flowField.length);

            if(this.effect.flowField[testIndex].alpha = 0) {
                this.x = this.effect.flowField[testIndex].x;
                this.y = this.effect.flowField[testIndex].y;
                this.history = [{x: this.x, y: this.y}];
                this.timer = this.maxLength * 2;
                resetSuccessful = true;
            }
        }

        if(!resetSuccessful) {
            this.x = Math.floor(Math.random() * canvas.width);
            this.y = Math.floor(Math.random() * canvas.height);
            this.history = [{x: this.x, y: this.y}];
            this.timer = this.maxLength * 2;
        }
    }
}

// Create a class Effect
class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.context = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.numberOfParticles = 2000;
        this.cellSize = 5;
        this.rows;
        this.cols;
        this.flowField = [];

        this.debug = true;
        this.init();
    
        window.addEventListener('keydown', (event) => {
            if(event.key === 'd') {
                this.debug = !this.debug;
            }
        });
    }

    drawText(context) {
        this.context.font = '500px Impact';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.4, '#FF0000');
        gradient1.addColorStop(0.6, '#FFFF00');
        gradient1.addColorStop(0.8, '#00FF00');
        gradient1.addColorStop(1, '#0000FF');

        const gradient2 = this.context.createRadialGradient(this.width / 2, this.height / 2, 10, this.width / 2, this.height / 2, this.width);
        gradient2.addColorStop(0.02, '#00f');
        gradient2.addColorStop(0.3, '#0c0');
        gradient2.addColorStop(0.4, '#ff0');
        
        this.context.fillStyle = gradient2;

        ctx.fillText('JS', this.width / 2, this.height / 2);
    }

    init() {
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];

        this.drawText(this.context);

        const pixels = this.context.getImageData(0, 0, this.width, this.height).data;

        for(let y = 0; y < this.height; y += this.cellSize) {
            for(let x = 0; x < this.width; x += this.cellSize) {
                const index = (x + y * this.width) * 4;
                const  red = pixels[index];
                const  green = pixels[index + 1];
                const  blue = pixels[index + 2];
                const  alpha = pixels[index + 3];
                const grayscale = (red + green + blue) / 3;
                
                const colorAngle = (Math.PI * 2 * (grayscale / 255)).toFixed(5);

                this.flowField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle,
                });
            }
        }

        this.particles = [];
        for(let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }

        this.particles.forEach(particle => particle.reset());
    }

    drawGrid() {
        this.context.save();
        this.context.strokeStyle = '#999';
        this.context.lineWidth = 0.5;

        for(let c = 0; c < this.cols + 1; c++) {
            this.context.beginPath();
            this.context.moveTo(c * this.cellSize, 0);
            this.context.lineTo(c * this.cellSize, this.height);
            this.context.stroke();
        }

        for(let r = 0; r < this.rows + 1; r++) {
            this.context.beginPath();
            this.context.moveTo(0, r * this.cellSize);
            this.context.lineTo(this.width, r * this.cellSize);
            this.context.stroke();
        }
        this.context.restore();
    }

    resize() {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.init();
    }

    render() {
        if(this.debug) {
            this.drawGrid();
            this.drawText();
        }

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.context);
        });
    }
}

const effect = new Effect(canvas, ctx);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // What to do each frame
    effect.render();
    requestAnimationFrame(animate);
}

animate();