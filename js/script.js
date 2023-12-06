// variaveis css
const root = document.querySelector(":root");
const rootStyles = getComputedStyle(root);
// console.log(rootStyles.getPropertyValue("--primary-color"));
// ***


// https://www.youtube.com/watch?v=Zdicf60eNzA
const canvas = document.getElementById("divertido");
const ctx = canvas.getContext("2d");

let melancia = new Image();
melancia.src = "https://www.onlygfx.com/wp-content/uploads/2021/01/watercolor-watermelon-1.png";
melancia.width = 50;
melancia.onload = renderImages;

let imgCount = 1;

function renderImages() {
    if (--imgCount > 0) {
        return
    }
    animate();
}

function drawBorder(){
    ctx.fillStyle = "#666666";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(20, 20, 560, 560);
}

class Suika {
    constructor(x,y) {
        this.x=x;
        this.y=y;
        this.topX = x-35;
        this.topY = y-140;
    }
    draw() {
        ctx.drawImage(melancia, this.topX, this.topY, 100, 100)
    }
}

let suika = new Suika(80,580);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBorder();
    suika.draw();
}
