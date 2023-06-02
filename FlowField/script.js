// Erstellle eine Variable für das Canvas Element
const canvas = document.getElementById('canvas1');

// Setzte die Breite und Höhe des Canvas Elements
canvas.width = 600;
canvas.height = 600;

// Definiere den Kontext des Canvas Elements (2D)
const ctx = canvas.getContext('2d');

// Erstelle die Klasse Particle
class Particle {
    // Definiere den Konstruktor der Klasse Particle (Parameter: effect)
    constructor(effect) {
        // Erstelle eine Referenz auf das Effect Objekt
        this.effect = effect;

        // Zufällige Position des Particles innerhalb des Canvas Elements
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        
        // Geschwindigkeit des Particles
        this.speedX;
        this.speedY;
        
        // Geschwindigkeitsmodifikator des Particles (1, 2 oder 3)
        this.speedModifier = Math.floor(Math.random() * 3 + 1);

        // Historie des Particles (Array mit Objekten)
        this.history = [{x: this.x, y: this.y}];

        // Maximale Länge der Historie des Particles (5 bis 15)
        this.maxLength = Math.floor(Math.random() * 10 + 5);

        // Winkel des Particles
        this.angle = 0;

        // Neuer Winkel des Particles
        this.newAngle = 0;

        // Korrektur des Winkels des Particles (0.01 bis 0.5)
        this.angleCorrector = Math.random() * 0.5 - 0.01;

        // Timer des Particles (2 * maxLength)
        this.timer = this.maxLength * 2;

        // Farben des Particles (Array mit Farben)
        this.colors = ['#DB005B', '#F79327', '#FFE569'];

        // Farbe des Particles (Zufällige Farbe aus dem Array)
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    // Zeichne das Particle (Parameter: context)
    draw(context) {
        // Beginne einen neuen Pfad
        context.beginPath();

        // Setzte den Startpunkt des Pfades auf die erste Position der Historie des Particles (x, y)
        context.moveTo(this.history[0].x, this.history[0].y);

        // Zeichne eine Linie zu allen weiteren Positionen der Historie des Particles (x, y)
        for (let i = 0; i < this.history.length; i++) {
            // Setzte den Endpunkt des Pfades auf die Position der Historie des Particles (x, y)
            context.lineTo(this.history[i].x, this.history[i].y);
        }

        // Setzte die Farbe des Pfades auf die Farbe des Particles und zeichne den Pfad
        context.strokeStyle = this.color;
        context.stroke();
    }

    // Aktualisiere das Particle
    update() {
        // Verringere den Timer des Particles um 1
        this.timer--;

        // Wenn der Timer des Particles kleiner als 1 ist ...
        if(this.timer >= 1) {
            // ... ermittle die Position des Particles im FlowField
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);

            // ... ermittle den Index des Particles im FlowField
            let index = x + y * this.effect.cols;

            // ... ermittle den Winkel des Particles
            if(this.effect.flowField[index]) {
                this.angle = this.effect.flowField[index].colorAngle;

                // ... ermittle den neuen Winkel des Particles
                if(this.angle > this.newAngle) {
                    // ... wenn der Winkel des Particles größer als der neue Winkel ist, verringere den Winkel des Particles um den Winkelkorrektor
                    this.angle -= this.angleCorrector;
                } else if(this.angle < this.newAngle) {
                    // ... wenn der Winkel des Particles kleiner als der neue Winkel ist, erhöhe den Winkel des Particles um den Winkelkorrektor
                    this.angle += this.angleCorrector;
                } else {
                    // ... wenn der Winkel des Particles gleich dem neuen Winkel ist, setzte den neuen Winkel auf den Winkel des Particles
                    this.angle = this.newAngle;
                }
            }

            // ... ermittle die Geschwindigkeit des Particles anhand des Winkels des Particles
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);

            // ... erhöhe die Position des Particles um die Geschwindigkeit des Particles und den Geschwindigkeitsmodifikator
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;

            // ... füge die aktuelle Position des Particles der Historie des Particles hinzu
            this.history.push({x: this.x, y: this.y});

            // ... wenn die Historie des Particles länger als die maximale Länge der Historie ist, entferne die erste Position der Historie
            if(this.history.length > this.maxLength) {
                this.history.shift();
            }
        // ... wenn der Timer des Particles größer als 1 ist ...
        } else if(this.history.length > 1) {
            // ... entferne die erste Position der Historie
            this.history.shift();
        } else {
            // führe die reset() Methode aus
            this.reset();
        }
    }

    // Setzte das Particle zurück
    reset() {
        // Erstelle einen Zähler für Versuche
        let attempts = 0;
        // Erstelle eine Variable für den Erfolg des Zurücksetzens
        let resetSuccessful = false;

        // Versuche das Particle an einer zufälligen Position im FlowField zu platzieren
        while(attempts < 10 && !resetSuccessful) {
            // Erhöhe den Zähler für Versuche um 1
            attempts++;

            // Ermittle einen zufälligen Index im FlowField und setzte das Particle an die Position des Index
            let testIndex = Math.floor(Math.random() * this.effect.flowField.length);

            // Wenn der Alpha-Wert des FlowFields an der Position des Index gleich 0 ist ...
            if(this.effect.flowField[testIndex].alpha = 0) {
                // ... setzte das Particle an die Position des Index
                this.x = this.effect.flowField[testIndex].x;
                this.y = this.effect.flowField[testIndex].y;

                // ... setzte die Historie des Particles auf die aktuelle Position des Particles
                this.history = [{x: this.x, y: this.y}];

                // ... setzte den Timer des Particles auf die maximale Länge der Historie des Particles multipliziert mit 2
                this.timer = this.maxLength * 2;

                // ... setzte den Erfolg des Zurücksetzens auf true
                resetSuccessful = true;
            }
        }

        // Wenn das Zurücksetzen nicht erfolgreich war, setzte das Particle an eine zufällige Position im Canvas
        if(!resetSuccessful) {
            // Setzte die Position des Particles auf eine zufällige Position im Canvas
            this.x = Math.floor(Math.random() * canvas.width);
            this.y = Math.floor(Math.random() * canvas.height);

            // Setzte die Historie des Particles auf die aktuelle Position des Particles
            this.history = [{x: this.x, y: this.y}];

            // Setzte den Timer des Particles auf die maximale Länge der Historie des Particles multipliziert mit 2
            this.timer = this.maxLength * 2;
        }
    }
}

// Erstelle eine Klasse für den Effekt
class Effect {
    // Erstelle einen Konstruktor für den Effekt und übergebe die Parameter canvas und context(ctx) an den Konstruktor 
    constructor(canvas, ctx) {
        // Erstelle Variablen für das Canvas und den Kontext
        this.canvas = canvas;
        this.context = ctx;

        // Erstelle Variablen für die Breite und Höhe des Canvas
        this.width = canvas.width;
        this.height = canvas.height;

        // Erstelle ein Array für die Particles
        this.particles = [];

        // Erstelle eine Variable für die Anzahl der Particles
        this.numberOfParticles = 2000;

        // Erstelle eine Variable für die Größe der Zellen des FlowFields
        this.cellSize = 5;

        // Erstelle Variablen für die Anzahl der Spalten und Zeilen des FlowFields
        this.rows;
        this.cols;

        // Erstelle ein Array für das FlowField
        this.flowField = [];

        // Debug-Modus
        this.debug = true;

        // Führe die init() Methode aus
        this.init();
    
        // Event-Listener für die Tastatur hinzufügen (Debug-Modus)
        window.addEventListener('keydown', (event) => {
            // Wenn die Taste 'd' gedrückt wurde ...
            if(event.key === 'd') {
                // ... setzte den Debug-Modus auf den Gegenteiligen Wert des Debug-Modus
                this.debug = !this.debug;
            }
        });
    }

    // Erstelle Methode drawText für den Effekt
    drawText(context) {
        // Setzte die Schriftart, Schriftgröße, Textausrichtung und Textbasislinie
        this.context.font = '500px Impact';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        // Erstelle einen linearen Farbverlauf für den Text
        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        // Füge Farben zum Farbverlauf hinzu (Position, Farbe)
        gradient1.addColorStop(0.4, '#FF0000');
        gradient1.addColorStop(0.6, '#FFFF00');
        gradient1.addColorStop(0.8, '#00FF00');
        gradient1.addColorStop(1, '#0000FF');

        /* Setzte den Radialen Farbverlauf als Füllstil für den Text 
        Die ersten 3 Argumente sind die Koordinaten des Mittelpunkts des Farbverlaufs, 
        die nächsten 3 Argumente sind die Koordinaten des Radius des Farbverlaufs */
        const gradient2 = this.context.createRadialGradient(this.width / 2, this.height / 2, 10, this.width / 2, this.height / 2, this.width);
        // Füge Farben zum Farbverlauf hinzu (Position, Farbe)
        gradient2.addColorStop(0.02, '#00f');
        gradient2.addColorStop(0.3, '#0c0');
        gradient2.addColorStop(0.4, '#ff0');
        
        // Setzte den Farbverlauf als Füllstil für den Text
        this.context.fillStyle = gradient2;

        // Fülle den Text mit dem Farbverlauf als Füllstil (Text, x, y)
        ctx.fillText('JS', this.width / 2, this.height / 2);
    }

    // Erstelle Methode init für den Effekt
    init() {
        // Setzte die Anzahl der Spalten und Zeilen des FlowFields
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);

        // Initialisiere das FlowField als leeres Array
        this.flowField = [];

        // Führe die Mehtode drawText() aus und übergebe den Kontext des Effekts an die Methode
        this.drawText(this.context);

        // Speichere die Pixel des Canvas in der Variable pixels ab
        const pixels = this.context.getImageData(0, 0, this.width, this.height).data;

        // iteriere über die Pixel des Canvas und erstelle für jeden Pixel ein Objekt im FlowField
        for(let y = 0; y < this.height; y += this.cellSize) {
            for(let x = 0; x < this.width; x += this.cellSize) {
                // Berechne den Index des Pixels im Array pixels (x + y * width) * 4 (4 weil RGBA)
                const index = (x + y * this.width) * 4;

                // Speichere die Werte des Pixels in Variablen ab (RGBA)
                const  red = pixels[index];
                const  green = pixels[index + 1];
                const  blue = pixels[index + 2];
                const  alpha = pixels[index + 3];
                
                // Berechne den Grauwert des Pixels (R + G + B) / 3
                const grayscale = (red + green + blue) / 3;
                
                // Berechne den Winkel des Farbwerts des Pixels (2 * PI * Grauwert / 255) und runde den Wert auf 5 Nachkommastellen
                const colorAngle = (Math.PI * 2 * (grayscale / 255)).toFixed(5);

                // Erstelle ein Objekt im FlowField mit den Werten x, y, alpha und colorAngle
                this.flowField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle,
                });
            }
        }

        // Erstelle ein Array für die Particles
        this.particles = [];

        // Erstelle die Particles und füge sie dem Array hinzu
        for(let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }

        // Iteriere über das Array mit den Particles und führe für jedes Particle die Methode reset() aus
        this.particles.forEach(particle => particle.reset());
    }

    // Erstelle Methode draw für den Effekt
    drawGrid() {
        // Speichere den aktuellen Zustand des Kontexts
        this.context.save();

        // Setzte den Strichstil und die Strichbreite
        this.context.strokeStyle = '#999';
        this.context.lineWidth = 0.5;

        // Iteriere über die Spalten des FlowFields und zeichne für jede Spalte eine Linie
        for(let c = 0; c < this.cols + 1; c++) {
            this.context.beginPath();
            this.context.moveTo(c * this.cellSize, 0);
            this.context.lineTo(c * this.cellSize, this.height);
            this.context.stroke();
        }

        // Iteriere über die Zeilen des FlowFields und zeichne für jede Zeile eine Linie
        for(let r = 0; r < this.rows + 1; r++) {
            this.context.beginPath();
            this.context.moveTo(0, r * this.cellSize);
            this.context.lineTo(this.width, r * this.cellSize);
            this.context.stroke();
        }

        // Stelle den Kontext wieder her
        this.context.restore();
    }

    // Erstelle Methode resize für den Effekt
    resize() {
        // Setzte die globale Breite und Höhe auf Canvas.width und height in Variablen ab
        this.canvas.width = width;
        this.canvas.height = height;

        // Setzte die Breite und Höhe des Objekts auf Canvas.width und height in Variablen ab 
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Führe die Methode init() aus
        this.init();
    }

    // Erstelle Methode render für den Effekt
    render() {
        // Wenn debug true ist, führe die Methode drawGrid() und drawText() aus
        if(this.debug) {
            this.drawGrid();
            this.drawText();
        }

        // Iteriere über das Array mit den Particles und führe für jedes Particle die Methoden update() und draw() aus
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.context);
        });
    }
}

// Erstelle eine Instanz der Klasse Effect und übergebe die Variablen canvas und ctx
const effect = new Effect(canvas, ctx);

// Function Animation Frame (wird 60 mal pro Sekunde aufgerufen)
function animate() {
    // Lösche den Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Führe die Methode render() aus
    effect.render();

    // Führe die Function Animation Frame wieder aus
    requestAnimationFrame(animate);
}

// Führe die Function animate() aus
animate();