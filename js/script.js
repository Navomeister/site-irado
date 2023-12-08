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

let melancias = []

let imgCont = 1;

let clickCont = 0;

let mouseX = [null];

function renderImages() {
    if (--imgCont > 0) {
        return
    }
    animate();
}

function drawBorder(){
    ctx.fillStyle = "#666666";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(40, 0, 520, 580);
    ctx.clearRect(0, 0, 600, 150);
    ctx.clearRect(0, 0, 20, 600);
    ctx.clearRect(580, 0, 20, 600);
}

class Melancia {
    constructor(x, y) {
        this.radius = 100;
        this.mass = this.radius;
        this.x = x;
        this.y = y;
        this.sprite = melancia;
        // this.dx = Math.cos(180) * 7;
        this.dy = Math.sin(-100) * 15;
    }

    move(){
        if (this.y <= 485) {
            this.y += this.dy;
        }
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, 100, 100)
    }
}

class Suika {
    constructor(x,y) {
        this.x=x;
        this.y=y;
        this.topX = x-35;
        this.topY = y-140;
    }
    // draw() {
    //     if (mouseX != null && mouseX <= 558 && mouseX >= 42) {
    //         ctx.drawImage(melancia, mouseX - 50, 0, 100, 100);
    //     }
    // }
}

let suika = new Suika(80,580);

function animate(x = null) {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBorder();
    melancias.forEach(melao => {
        melao.move();

        melao.draw();

        // console.log(melao);
    });
}


canvas.addEventListener("click", e => {
    mouseX = e.clientX - canvas.offsetLeft;
    clickCont++;
    if (mouseX > 517) {
        mouseX = 517
    }
    else if (mouseX < 82) {
        mouseX = 82
    }
    melancias.push(
        new Melancia(mouseX - 50, 1)
    );
    // console.log(suikas);
    
})
