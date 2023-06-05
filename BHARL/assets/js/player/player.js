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

export class Player {
    constructor(x, y, width, height, ) { // spriteSheet, spriteSheetCols, spriteSheetRows
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.keyState = {};
        // this.spriteSheet = new spriteSheet(spriteSheet, spriteSheetCols, spriteSheetRows);

        window.addEventListener('keydown', (e) => {
            this.keyState[e.keyCode] = true;
            console.log(`key down: ${e.keyCode}`);
        });

        window.addEventListener('keyup', (e) => {
            this.keyState[e.keyCode] = false;
       });
    }

    movePlayer() {
        if(this.keyState[Keys.LEFT] && !this.keyState[Keys.RIGHT] ||
            this.keyState[Keys.A] && !this.keyState[Keys.D]) {
            this.x -= this.speed;
        }
        if(this.keyState[Keys.RIGHT] && !this.keyState[Keys.LEFT] ||
            this.keyState[Keys.D] && !this.keyState[Keys.A]) {
            this.x += this.speed;
        }
        if(this.keyState[Keys.Up] && !this.keyState[Keys.Down] ||
            this.keyState[Keys.W] && !this.keyState[Keys.S]) {
            this.y -= this.speed;
        }
        if(this.keyState[Keys.Down] && !this.keyState[Keys.Up] ||
            this.keyState[Keys.S] && !this.keyState[Keys.W]) {
            this.y += this.speed;
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#ccc';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }
}