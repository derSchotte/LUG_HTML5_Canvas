const Keys = {
    LEFT: 37,
    RIGHT: 39,
    Up: 38,
    Down: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
};

class SpriteSheet {
    constructor(image, cols, rows) {
        this.image = new Image();

        this.image.onload = () => {
            this.frameWidth = this.image.width / this.cols;
            this.frameHeight = this.image.height / this.rows;
        };
        this.image.src = image;

        this.cols = cols;
        this.rows = rows;

        this.totalFrames = this.cols * this.rows;
        this.currentFrame = 0;

        this.direction = {
            'animIdle': { start: -1, end: 0 },
            'animDown': { start: 4 * this.cols, end: 4 * this.cols + 5 },
            'animUp': { start: 5 * this.cols, end: 5 * this.cols + 5 },
            'animRight': { start: 6 * this.cols, end: 6 * this.cols + 5 },
            'animLeft': { start: 7 * this.cols, end: 7 * this.cols + 5 },
        }
    }

    updateFrame(direction = 'animIdle') {
        const frames = this.direction[direction];

        if(this.currentFrame < frames.start || this.currentFrame >= frames.end) {
            this.currentFrame = frames.start;
        }

        if(!this.frameCounter) {
            this.frameCounter = 0;
        }

        const frameRate = 5;

        if(this.frameCounter % frameRate === 0) {
            this.currentFrame = ++this.currentFrame % this.totalFrames;
            this.sX = Math.floor(this.currentFrame % this.cols) * this.frameWidth;
            this.sY = Math.floor(this.currentFrame / this.cols) * this.frameHeight;
        }

        this.frameCounter++;
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.image, this.sX, this.sY, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
    }
}

export class Player {
    constructor(x, y, width, height, spriteSheet, spriteSheetCols, spriteSheetRows) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.keyState = {};
        this.spriteSheet = new SpriteSheet(spriteSheet, spriteSheetCols, spriteSheetRows);

        window.addEventListener('keydown', (e) => {
            this.keyState[e.keyCode] = true;
            // console.log(`key down: ${e.keyCode}`);
        });

        window.addEventListener('keyup', (e) => {
            this.keyState[e.keyCode] = false;
       });
    }

    movePlayer() {
        let direction = 'animIdle';
        let dx = 0;
        let dy = 0;

        if(this.keyState[Keys.LEFT] && !this.keyState[Keys.RIGHT] ||
            this.keyState[Keys.A] && !this.keyState[Keys.D]) {
            dx = -1;
            direction = 'animLeft';
        }
        if(this.keyState[Keys.RIGHT] && !this.keyState[Keys.LEFT] ||
            this.keyState[Keys.D] && !this.keyState[Keys.A]) {
            dx = 1;
            direction = 'animRight';
        }
        if(this.keyState[Keys.Up] && !this.keyState[Keys.Down] ||
            this.keyState[Keys.W] && !this.keyState[Keys.S]) {
            dy = -1;
            direction = 'animUp';
        }
        if(this.keyState[Keys.Down] && !this.keyState[Keys.Up] ||
            this.keyState[Keys.S] && !this.keyState[Keys.W]) {
            dy = 1;
            direction = 'animDown';
        }

        if(dx !== 0 && dy !== 0) {
            dx *= Math.sqrt(2)/2;
            dy *= Math.sqrt(2)/2;
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        this.spriteSheet.updateFrame(direction);
    }

    render(ctx) {
        this.spriteSheet.draw(ctx, this.x, this.y);
    }
}