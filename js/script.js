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
        this.radius = 45;
        this.mass = this.radius;
        this.x = x;
        this.y = y;
        this.sprite = melancia;
        if (Math.random() < 0.5) {
            this.dx = Math.cos(180) * 7;
        }
        else {
            this.dx = Math.cos(180) * -7;
        }
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
        this.dx = this.dx - (this.dx * this.friction);
        this.y += this.dy;
        this.x += this.dx;
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
    melancias.forEach((melao, index) => {
        melao.move();

        bateuParede(melao);
        
        collide(index);

        melao.draw();
    });
}

function bateuParede(melancia) {
    if (melancia.y >= 485 ||
        melancia.x < 30 || 
        melancia.x > 465) {
        if (melancia.y >= 485){
            melancia.y = 485;
            melancia.dy = 0;
        }
        if (melancia.x > 465) {
            melancia.x = 465;
            melancia.dx *= -1;
        }
        if (melancia.x < 30) {
            melancia.x = 30;
            melancia.dx *= -1;
        }
    }
}

function ballHitBall(ball1, ball2) {
    let collision = false;
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    //Modified pythagorous, because sqrt is slow
    let distance = (dx * dx + dy * dy);
    if(distance <= (ball1.radius + ball2.radius)*(ball1.radius + ball2.radius)){
        collision = true;
    }
    return collision;
}

function collideBalls(ball1,ball2){
    //It matters that we are getting the exact difference from ball 1 & ball 2
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    //Work out the normalized collision vector (direction only)
    let vCollisionNorm = {x: dx / distance, y:dy/distance}
    //Relative velocity of ball 2
    let vRelativeVelocity = {x: ball1.dx - ball2.dx,y:ball1.dy - ball2.dy};
    //Calculate the dot product
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
    //Don't do anything because balls are already moving out of each others way
    if(speed < 0) {
        return;
    }
    let impulse = 2 * speed / (ball1.mass + ball2.mass);
    //Becuase we calculated the relative velocity of ball2. Ball1 needs to go in the opposite direction, hence a collision.
    ball1.dx -= (impulse * ball2.mass * vCollisionNorm.x);
    ball1.dy -= (impulse * ball2.mass * vCollisionNorm.y);
    ball2.dx += (impulse * ball1.mass * vCollisionNorm.x);
    ball2.dy += (impulse * ball1.mass * vCollisionNorm.y);
    
    //Still have to account for elasticity
    // ball1.dy = (ball1.dy * ball1.elasticity);
    // ball2.dy = (ball2.dy * ball2.elasticity);
}

function collide(index) {
    let ball = melancias[index];
    for(let j = index + 1; j < melancias.length; j++){
        let testBall = melancias[j];
        if(ballHitBall(ball,testBall)){
            collideBalls(ball,testBall);
        }
    }
}

// function colisao (index) {
//     let melancia = melancias[index];
//     for (let i = index; i < melancias.length; i++) {
//         let melanciaColisora = melancias[i];
//         if (bateuMelancias(melancia, melanciaColisora)) {
//             handleColisao (melancia, melanciaColisora);
//         }
//     }
// }

// function bateuMelancias (melancia1, melancia2) {
//     let collision = false;
//     let dx = melancia1.x - melancia2.x;
//     let dy = melancia1.y - melancia2.y;
//     let distance = (dx * dx + dy * dy);
//     if (distance <= (melancia1.radius + melancia2.radius) * (melancia1.radius + melancia2.radius)) {
//         collision = true;
//     }
//     return collision;
// }

// function handleColisao (melancia1, melancia2) {
//     console.log("a");
//     let dx = melancia2.x - melancia1.x;
//     let dy = melancia2.y - melancia1.y;
//     let distance = Math.sqrt(dx * dx + dy * dy);
//     let normaColisao = {x: dx / distance, y: dy / distance};
//     let velRelativa = {x: melancia1.dx - melancia2.dx, y: melancia1.dy - melancia2.dy};
//     let velocidade = velRelativa.x * normaColisao.x + velRelativa.y * normaColisao.y;
//     if (velocidade < 0) {
//         return;
//     }
//     let impulso = 2 * velocidade / (melancia1.mass + melancia2.mass);
//     melancia1.dx -= (impulso * melancia2.mass * normaColisao.x);
//     melancia1.dy -= (impulso * melancia2.mass * normaColisao.y);
//     melancia2.dx += (impulso * melancia1.mass * normaColisao.x);
//     melancia2.dy += (impulso * melancia1.mass * normaColisao.y);
// }

canvas.addEventListener("click", e => {
    mouseX = e.clientX - canvas.offsetLeft;
    clickCont++;
    melancias.push(
        new Melancia(mouseX - 50, 1)
    );
    console.log(e.clientY - canvas.offsetTop);
    
})
