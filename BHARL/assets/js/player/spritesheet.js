// Erstellen einer Klasse für das SpriteSheet
export class SpriteSheet {
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