import {SpriteSheet} from "../player/spritesheet.js";

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

        // OLD this.spriteSheet = new SpriteSheet(spriteSheet, spriteSheetCols, spriteSheetRows);
        this.spriteSheets = [new SpriteSheet(spriteSheet, spriteSheetCols, spriteSheetRows)];

        // EventListener für keydown und keyup Events zum Setzen der keyState Eigenschaft des Spielers
        window.addEventListener('keydown', (e) => {
            this.keyState[e.keyCode] = true;
            // console.log(`key down: ${e.keyCode}`);
        });

        window.addEventListener('keyup', (e) => {
            this.keyState[e.keyCode] = false;
        });
    }

    // NEW
    addSpriteSheet(spriteSheet) {
        this.spriteSheets.push(spriteSheet);
    }

    removeSpriteSheet(spriteSheet) {
        const index = this.spriteSheets.indexOf(spriteSheet);
        if(index !== -1) {
            this.spriteSheets.splice(index, 1);
        }
    }

    addHat(hatSpriteSheet, hatSpriteSheetCols, hatSpriteSheetRows) {
        const hat = new SpriteSheet(hatSpriteSheet, hatSpriteSheetCols, hatSpriteSheetRows);
        hat.zIndex = 2;
        this.addSpriteSheet(hat);
    }

    addKleidung(kleidungSpriteSheet, kleidungSpriteSheetCols, kleidungSpriteSheetRows) {
        const kleidung = new SpriteSheet(kleidungSpriteSheet, kleidungSpriteSheetCols, kleidungSpriteSheetRows);
        kleidung.zIndex = 1;
        this.addSpriteSheet(kleidung);
    }

    // END NEW

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
        // OLD this.spriteSheet.updateFrame(direction);

        for(const spriteSheet of this.spriteSheets) {
            spriteSheet.updateFrame(direction);
        }
    }

    // Funktion zum Zeichnen des Spielers mit dem Canvas Context als Parameter
    render(ctx) {
        // Aufruf der draw Funktion des SpriteSheets mit dem Canvas Context, x und y Position als Parameter
        // this.spriteSheet.draw(ctx, this.x, this.y);
        this.spriteSheets.sort((a, b) => a.zIndex - b.zIndex);

        for(const spriteSheet of this.spriteSheets) {
            spriteSheet.draw(ctx, this.x, this.y);
        }

    }
}