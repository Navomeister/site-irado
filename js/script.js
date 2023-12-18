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
melancia.onload = renderImages;

let melao = new Image();
melao.src = "https://png.pngtree.com/png-clipart/20210523/original/pngtree-whole-round-melon-png-image_6330243.png"
melao.onload = renderImages;

let melancias = []

let imgCont = 2;

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
    constructor(x, y, raio) {
        this.radius = raio;
        this.mass = this.radius;
        this.x = x;
        this.y = y;
        switch (raio) {
            case 75:
                this.nome = "melao";
                this.sprite = melao;
                break;
        
            default:
                this.nome = "melancia";
                this.sprite = melancia;
                break;
        }
        // this.sprite = melancia;
        // if (Math.random() < 0.5) {
        //     this.dx = Math.cos(180) * 7;
        // }
        // else {
        //     this.dx = Math.cos(180) * -7;
        // }
        this.dx = 0;
        this.dy = Math.sin(-100) * 15;
        this.gravity = 0.05;
        this.friction = 0.015;
    }

    move(){
        if (this.y + this.gravity < 580) {
            this.dy +=  this.gravity;
        }
        if (this.dy < 0) {
            this.dy *= -1;
        }
        this.dy = this.dy - (this.dy * this.friction);
        this.dx = this.dx - (this.dx * this.friction);
        if (this.y + this.radius * 2 < 580) {
            this.y += this.dy;
        }
        this.x += this.dx;
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.radius * 2, this.radius * 2)
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
    melancias.forEach((melao, index) => {
        bateuParede(melao);
        
        collide(index);

        melao.move();
        
        melao.draw();
    });
}

function bateuParede(melancia) {
    if (melancia.y + melancia.radius * 2 >= 590 ||
        melancia.x < 35 || 
        melancia.x + melancia.radius * 2 > 570) {
        if (melancia.y + melancia.radius * 2 >= 590){
            melancia.y = 590 - melancia.radius;
            melancia.dy = 0;
        }
        if (melancia.x + melancia.radius * 2 > 565) {
            melancia.x = 565 - melancia.radius * 2;
            melancia.dx *= -1;
        }
        if (melancia.x < 35) {
            melancia.x = 35;
            melancia.dx *= -1;
        }
    }
}

function bateuMelancia(melao1, melao2) {
    let collision = false;
    let dx = melao1.x - melao2.x;
    let dy = melao1.y - melao2.y;
    //Modified pythagorous, because sqrt is slow
    let distance = (dx * dx + dy * dy);
    if(distance <= (melao1.radius + melao2.radius)*(melao1.radius + melao2.radius)){
        collision = true;
    }
    return collision;
}

function colideMelancias(melao1,melao2){
    // Pega a diferença exata entre os dois melao
    let dx = melao2.x - melao1.x;
    let dy = melao2.y - melao1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Work out the normalized collision vector (direction only)
    // nao entendi o que isso faz :/
    let vCollisionNorm = {x: dx / distance, y:dy/distance}
    // Velocidade relativa do segundo melao
    let vRelativeVelocity = {x: melao1.dx - melao2.dx,y:melao1.dy - melao2.dy};
    // Calcula o produto
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
    // Não faz nada porque as melancias ja estao se distanciando
    if(speed < 0) {
        return;
    }
    let impulse = 2 * speed / (melao1.mass + melao2.mass);
    // A partir da velocidade relativa do melao2, pega a velocidade p/ o melao1, já que é uma colisão
    melao1.dx -= (impulse * melao2.mass * vCollisionNorm.x);
    melao1.dy -= (impulse * melao2.mass * vCollisionNorm.y);
    melao2.dx += (impulse * melao1.mass * vCollisionNorm.x);
    melao2.dy += (impulse * melao1.mass * vCollisionNorm.y);
}

function collide(index) {
    let melao = melancias[index];
    for(let j = 0; j < melancias.length; j++){
        if (j != index) {
            let melaoTeste = melancias[j];
            if(bateuMelancia(melao,melaoTeste)){
                // testeColisao(melao, melaoTeste);
                colideMelancias(melao,melaoTeste);   
                if (melao.nome == melaoTeste.nome) {
                    fusao(index, j);
                }
            }
        }
    }
}

function fusao(index1, index2) {
    raio = melancias[index1].radius;
    x = melancias[index1].x;
    y = melancias[index1].y;
    melancias.splice(index2, 1);
    melancias.splice(index1, 1);
    melancias.push(
        new Melancia(x, y, 75)
    );
}

canvas.addEventListener("click", e => {
    mouseX = e.clientX - canvas.offsetLeft;
    let mouseY = e.clientY - canvas.offsetTop;
    clickCont++;
    melancias.push(
        new Melancia(mouseX - 50, mouseY, 50)
    );
    
})
