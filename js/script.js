// variaveis css
const root = document.querySelector(":root");
const rootStyles = getComputedStyle(root);
// console.log(rootStyles.getPropertyValue("--primary-color"));
// ***


// https://www.youtube.com/watch?v=Zdicf60eNzA
let suikaImg = new Image();
suikaImg.src = ("https://www.onlygfx.com/wp-content/uploads/2021/01/watercolor-watermelon-2.png");
suikaImg.onload = renderizar;

let qtImg = 1;

const canvas = document.getElementById("divertido");
const contexto = canvas.getContext("2d");

// funçoes
function renderizar() {
    if (--qtImg > 0) {
        return;
    }
    animar();
}

class Suika {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    stand() {
        contexto.beginPath();
        contexto.moveTo(this.x, this.y);
        contexto.lineTo(this.x+15, this.y-50);
        contexto.lineTo(this.x+30, this.y);
        contexto.stroke();
    }
    
    draw() {
        this.stand();
        // contexto.drawImage(suikaImg, this.x, this.y, 100, 50);
    }
}

let suika = new Suika(40, 200)

function desenhaBorda() {
    contexto.fillStyle = rootStyles.getPropertyValue("--primary-color");
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.clearRect(10, 0, 280, 145);
}

function animar() {
    requestAnimationFrame(animar);
    contexto.clearRect(0,0,canvas.width,canvas.height);
    // desenha a borda
    desenhaBorda();
    suika.draw();
}