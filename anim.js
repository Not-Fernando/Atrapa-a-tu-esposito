const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas responsive
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.5;

// FUNCIÓN para calcular escala según dispositivo
function calcularEscala() {
    let escala;

    // Celular
    if (window.innerWidth <= 600) {
        escala = Math.floor(canvas.width / 150);
        if (escala < 2) escala = 2;
        if (escala > 5) escala = 5;
    }
    // PC
    else {
        escala = Math.floor(canvas.width / 350);
        if (escala < 1) escala = 1;
        if (escala > 3) escala = 3;
    }

    return escala;
}

// Aplicar escala
let escala = calcularEscala();
let espositaWidth = 44 * escala;
let espositaHeight = 100 * escala;

// Cargar imágenes
const espositaConCajita = new Image();
espositaConCajita.src = "img/Esposita Con Cajita.png";

const rightFrames = [new Image(), new Image()];
rightFrames[0].src = "img/Esposita Derecha - Pie DE.png";
rightFrames[1].src = "img/Esposita Derecha - Pie IZ.png";

const leftFrames = [new Image(), new Image()];
leftFrames[0].src = "img/Esposita Izquierda - Pie IZ.png";
leftFrames[1].src = "img/Esposita Izquierda - Pie DE.png";

// Jugadora
let esposita = {
    x: canvas.width / 2 - espositaWidth / 2,
    y: canvas.height - espositaHeight - 20,
    width: espositaWidth,
    height: espositaHeight,
    speed: 12,
    frameCounter: 0
};

// Controles teclado
let teclas = {};
document.addEventListener("keydown", e => teclas[e.key] = true);
document.addEventListener("keyup", e => teclas[e.key] = false);

// Controles táctiles y mouse
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let touchLeft = false;
let touchRight = false;

// Activación
function activarIzquierda() { touchLeft = true; }
function activarDerecha() { touchRight = true; }

// Desactivación
function desactivarIzquierda() { touchLeft = false; }
function desactivarDerecha() { touchRight = false; }

// Eventos táctiles
leftBtn.addEventListener("touchstart", activarIzquierda);
leftBtn.addEventListener("touchend", desactivarIzquierda);
rightBtn.addEventListener("touchstart", activarDerecha);
rightBtn.addEventListener("touchend", desactivarDerecha);

// Eventos mouse
leftBtn.addEventListener("mousedown", activarIzquierda);
leftBtn.addEventListener("mouseup", desactivarIzquierda);
rightBtn.addEventListener("mousedown", activarDerecha);
rightBtn.addEventListener("mouseup", desactivarDerecha);

// Función de movimiento
function moverEsposita() {
    let moving = false;

    if (teclas["ArrowRight"] || touchRight) {
        esposita.x += esposita.speed;
        moving = true;
    } 
    else if (teclas["ArrowLeft"] || touchLeft) {
        esposita.x -= esposita.speed;
        moving = true;
    }

    if (moving) esposita.frameCounter++;
    else esposita.frameCounter = 0;

    // Limites
    if (esposita.x < 0) esposita.x = 0;
    if (esposita.x > canvas.width - esposita.width)
        esposita.x = canvas.width - esposita.width;
}

// Dibujar esposita
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let frameIndex = Math.floor(esposita.frameCounter / 5) % 2;

    if (teclas["ArrowRight"] || touchRight) {
        ctx.drawImage(rightFrames[frameIndex], esposita.x, esposita.y, esposita.width, esposita.height);
    }
    else if (teclas["ArrowLeft"] || touchLeft) {
        ctx.drawImage(leftFrames[frameIndex], esposita.x, esposita.y, esposita.width, esposita.height);
    }
    else {
        ctx.drawImage(espositaConCajita, esposita.x, esposita.y, esposita.width, esposita.height);
    }
}

// Bucle principal
function gameLoop() {
    moverEsposita();
    dibujar();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Responsive al cambiar tamaño
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.5;

    escala = calcularEscala();
    espositaWidth = 44 * escala;
    espositaHeight = 100 * escala;

    esposita.width = espositaWidth;
    esposita.height = espositaHeight;
});

/* ===============================
   🚨 ANIMACIÓN: ESPOSITO CAYENDO
   =============================== */

// Cargar imágenes del esposito
const espositoFrames = [];
for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `img/Esposito${i}.png`;
    espositoFrames.push(img);
}

// Clase Esposito que cae
class EspositoCayendo {
    constructor() {

        // Sale desde más arriba del cielo
        this.y = -canvas.height;

        // Caída horizontal aleatoria
        this.x = Math.random() * (canvas.width - 40 * escala);

        // Velocidad de caída
        this.speed = 4 + Math.random() * 3;

        // Frame inicial aleatorio
        this.frame = Math.floor(Math.random() * 6);

        // Tamaño responsive similar a esposita
        this.width = 40 * escala;
        this.height = 90 * escala;

        this.estado = "cayendo";
        this.tiempoPiso = 0;
        this.almaY = 0;
    }

    actualizar() {
        if (this.estado === "cayendo") {
            this.y += this.speed;

            // Al llegar al piso
            if (this.y >= canvas.height - this.height / 3) {
                this.estado = "piso";
                this.y = canvas.height - this.height / 3;
            }
        }
        else if (this.estado === "piso") {
            this.tiempoPiso++;

            if (this.tiempoPiso > 60) {
                this.estado = "alma";
                this.almaY = this.y;
            }
        }
        else if (this.estado === "alma") {
            this.almaY -= 2;

            if (this.almaY < -200) {
                return false;
            }
        }

        return true;
    }

    dibujar() {
        if (this.estado === "cayendo") {
            ctx.drawImage(espositoFrames[this.frame], this.x, this.y, this.width, this.height);
        }
        else if (this.estado === "piso") {
            ctx.drawImage(espositoFrames[6], this.x, this.y, this.width, this.height);
        }
        else if (this.estado === "alma") {
            ctx.drawImage(espositoFrames[7], this.x, this.almaY, this.width, this.height);
        }
    }
}

// Lista de espositos cayendo
let espositos = [];

// Cada 1 segundo cae un nuevo esposito
setInterval(() => {
    espositos.push(new EspositoCayendo());
}, 1000);

// DIBUJAR ESPOSITOS dentro del bucle principal
const dibujarOriginal = dibujar;
dibujar = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar esposita
    dibujarOriginal();

    // Dibujar espositos
    espositos = espositos.filter(e => {
        const seguir = e.actualizar();
        e.dibujar();
        return seguir;
    });
};
