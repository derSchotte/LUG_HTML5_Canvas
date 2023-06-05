// Erstellen eines Objektes mit Keycodes für die Pfeiltasten und WASD
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

// Erstellen einer Klasse für das SpriteSheet
class SpriteSheet {
    // Konstruktor mit den Parametern image, cols, rows
    constructor(image, cols, rows) {
        // Erstellen eines neuen Image Objektes
        this.image = new Image();

        // Image.onload Funktion, die ausgeführt wird, wenn das Bild geladen wurde
        this.image.onload = () => {
            // Setzen der Breite und Höhe eines Frames
            this.frameWidth = this.image.width / this.cols;
            this.frameHeight = this.image.height / this.rows;
        };

        // Setzen der Quelle des Bildes
        this.image.src = image;

        // Setzen der Anzahl der Spalten und Reihen
        this.cols = cols;
        this.rows = rows;

        // Setzen der Startposition des Frames
        this.totalFrames = this.cols * this.rows;
        this.currentFrame = 0;

        // direction Object in der alle Richtungen mit den Start- und Endpositionen gespeichert werden
        this.direction = {
            // Name der Richtung: { start: Startposition, end: Endposition  + Anzahl der Frames}
            'animIdle': { start: -1, end: 0 },
            'animDown': { start: 4 * this.cols, end: 4 * this.cols + 5 },
            'animUp': { start: 5 * this.cols, end: 5 * this.cols + 5 },
            'animRight': { start: 6 * this.cols, end: 6 * this.cols + 5 },
            'animLeft': { start: 7 * this.cols, end: 7 * this.cols + 5 },
        }
    }

    // Funktion zum Updaten des Frames mit der Richtung als Parameter (Standardwert: animIdle)
    updateFrame(direction = 'animIdle') {
        // Variable frames mit den Start- und Endpositionen der Richtung aus dem direction Object
        const frames = this.direction[direction];

        // Wenn der aktuelle Frame kleiner als der Startframe oder größer oder gleich dem Endframe ist, 
        // wird der aktuelle Frame auf den Startframe gesetzt.
        if (this.currentFrame < frames.start || this.currentFrame >= frames.end) {
            this.currentFrame = frames.start;
        }

        // Wenn frameCounter nicht existiert, wird er auf 0 gesetzt (erstes Mal)
        if (!this.frameCounter) {
            this.frameCounter = 0;
        }

        // frameRate gibt an, wie oft pro Sekunde der Frame gewechselt werden soll
        const frameRate = 5;

        // Wenn frameCounter durch frameRate "Restlos" teilbar ist ...
        if (this.frameCounter % frameRate === 0) {
            // ... wird der aktuelle Frame um 1 erhöht und mit der Anzahl der Frames des Spritesheets modulo gerechnet
            this.currentFrame = ++this.currentFrame % this.totalFrames;

            // ... wird die Startposition des Frames neu berechnet
            this.sX = Math.floor(this.currentFrame % this.cols) * this.frameWidth;
            this.sY = Math.floor(this.currentFrame / this.cols) * this.frameHeight;
        }

        // frameCounter wird um 1 erhöht
        this.frameCounter++;
    }

    // Funktion zum Zeichnen des Frames mit dem Canvas Context, x und y Position als Parameter
    draw(ctx, x, y) {
        // Aufruf der drawImage Funktion des Canvas Context mit den Parametern 
        // image, sX, sY, sWidth, sHeight, dx, dy, dWidth, dHeight
        ctx.drawImage(this.image, this.sX, this.sY, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
    }
}

// Erstellen einer Klasse für den Spieler
export class Player {
    // Konstruktor mit den Parametern x, y, width, height, spriteSheet, spriteSheetCols, spriteSheetRows
    constructor(x, y, width, height, spriteSheet, spriteSheetCols, spriteSheetRows) {
        // Setzen der x, y, width, height, speed, keyState und spriteSheet Eigenschaften
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.keyState = {};
        this.spriteSheet = new SpriteSheet(spriteSheet, spriteSheetCols, spriteSheetRows);

        // EventListener für keydown und keyup Events zum Setzen der keyState Eigenschaft des Spielers
        window.addEventListener('keydown', (e) => {
            this.keyState[e.keyCode] = true;
            // console.log(`key down: ${e.keyCode}`);
        });

        window.addEventListener('keyup', (e) => {
            this.keyState[e.keyCode] = false;
        });
    }

    // Bewegung des Spielers mit der update Funktion
    movePlayer() {
        // dx und dy werden auf 0 gesetzt und direction auf animIdle (Standardwert)
        let direction = 'animIdle';
        let dx = 0;
        let dy = 0;

        // Wenn die Taste links gedrückt wird und nicht die Taste rechts oder die Taste A gedrückt wird und nicht die Taste D ...
        if (this.keyState[Keys.LEFT] && !this.keyState[Keys.RIGHT] ||
            this.keyState[Keys.A] && !this.keyState[Keys.D]) {
            // ... wird dx auf -1 gesetzt und direction auf animLeft gesetzt (Richtung links)
            dx = -1;
            direction = 'animLeft';
        }
        if (this.keyState[Keys.RIGHT] && !this.keyState[Keys.LEFT] ||
            this.keyState[Keys.D] && !this.keyState[Keys.A]) {
            // ... wird dx auf 1 gesetzt und direction auf animRight gesetzt (Richtung rechts)
            dx = 1;
            direction = 'animRight';
        }
        if (this.keyState[Keys.Up] && !this.keyState[Keys.Down] ||
            this.keyState[Keys.W] && !this.keyState[Keys.S]) {
            // ... wird dy auf -1 gesetzt und direction auf animUp gesetzt (Richtung oben)
            dy = -1;
            direction = 'animUp';
        }
        if (this.keyState[Keys.Down] && !this.keyState[Keys.Up] ||
            this.keyState[Keys.S] && !this.keyState[Keys.W]) {
            // ... wird dy auf 1 gesetzt und direction auf animDown gesetzt (Richtung unten)
            dy = 1;
            direction = 'animDown';
        }

        // Wenn dx und dy nicht 0 sind und dx und dy nicht gleichzeitig 0 sind ...
        if (dx !== 0 && dy !== 0) {
            // ... werden dx und dy mit dem Faktor 1 / Wurzel aus 2 multipliziert
            dx *= Math.sqrt(2) / 2;
            dy *= Math.sqrt(2) / 2;
        }

        // Die x und y Position des Spielers wird mit dx und dy multipliziert mit der Geschwindigkeit aktualisiert
        // Damit die Geschwindigkeit immer gleich ist, egal ob diagonal oder gerade
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Aufruf der updateFrame Funktion des SpriteSheets mit der direction als Parameter
        this.spriteSheet.updateFrame(direction);
    }

    // Funktion zum Zeichnen des Spielers mit dem Canvas Context als Parameter
    render(ctx) {
        // Aufruf der draw Funktion des SpriteSheets mit dem Canvas Context, x und y Position als Parameter
        this.spriteSheet.draw(ctx, this.x, this.y);
    }
}