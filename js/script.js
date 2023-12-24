// variaveis css
const root = document.querySelector(":root");
const rootStyles = getComputedStyle(root);
// console.log(rootStyles.getPropertyValue("--primary-color"));
// ***

// https://www.youtube.com/watch?v=Zdicf60eNzA
const canvas = document.getElementById("divertido");
const ctx = canvas.getContext("2d");

let melancia = new Image();
melancia.src = "images/sprites/melancia.png";
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
        this.dx = 0;
        // if (Math.random() < 0.5) {
        //     this.dx = Math.cos(180) * 7;
        // }
        // else {
        //     this.dx = Math.cos(180) * -7;
        // }
        
        this.dy = Math.sin(-100) * 15;
        this.gravity = 0.05;
        this.friction = 0.015;
    }

    move(index){
      let cai = true;
      for (let i = 0; i < melancias.length; i++) {
         if (i != index) {
            let melaoTeste = melancias[i];
            let distanceX = Math.abs((melaoTeste.x + melaoTeste.radius) - this.x);
            if (melaoTeste.y <= this.y + this.radius * 2 && distanceX <= this.radius * 2) {
               if (this.dx <= 0.05) {
                  cai = false;
                  break;
               }
            }
         }
      }
        if (this.y + this.gravity < 580 && cai) {
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

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBorder();
    melancias.forEach((melao, index) => {
        melao.move(index);
        
        bateuParede(melao);
        
        collide(index);
        
        melao.draw();
    });
}

function bateuParede(melancia) {
    if (melancia.y + melancia.radius * 2 >= 580 ||
        melancia.x < 40 || 
        melancia.x + melancia.radius * 2 > 560) {
        if (melancia.y + melancia.radius * 2 >= 580){
            melancia.y = 580 - melancia.radius * 2;
            melancia.dy = 0;
        }
        if (melancia.x + melancia.radius * 2 > 560) {
            melancia.x = 560 - melancia.radius * 2;
            melancia.dx *= -1;
        }
        if (melancia.x < 40) {
            melancia.x = 40;
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
    //Work out the normalized collision vector (direction only)
    let vCollisionNorm = {x: dx / distance, y:dy/distance}
    //Relative velocity of ball 2
    let vRelativeVelocity = {x: melao1.dx - melao2.dx,y:melao1.dy - melao2.dy};
    //Calculate the dot product
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
    //Don't do anything because balls are already moving out of each others way
    if(speed < 0) {
        return;
    }
    let impulse = 2 * speed / (melao1.mass + melao2.mass);
    //Becuase we calculated the relative velocity of melao2. melao1 needs to go in the opposite direction, hence a collision.
    melao1.dx -= (impulse * melao2.mass * vCollisionNorm.x);
    melao1.dy -= (impulse * melao2.mass * vCollisionNorm.y);
    melao2.dx += (impulse * melao1.mass * vCollisionNorm.x);
    melao2.dy += (impulse * melao1.mass * vCollisionNorm.y);
   //  if (distance < (melao1.radius * 2 + melao2.radius * 2)) {
   //      let dxT = melao2.x - melao1.x;
   //      let dyT = melao2.y - melao1.y;
   //      if (melao2.x < 40 || 
   //          melao2.x + melao2.radius * 2 > 560) {
   //          melao1.x -= dxT;
   //      }
   //      else {
   //          melao1.x -= dxT / 2;
   //          melao2.x += dxT / 2;
   //      }
   //      if (melao2.y + melao2.radius * 2 >= 580) {
            
   //          melao1.y -= dyT / 2;
   //      }
   //      else {
   //          melao1.y -= dyT / 2;
   //          melao2.y += dyT / 2;
   //      }
   //      console.log(distance);
   //  }
}


function collide(index) {
    let melao = melancias[index];
    for(let j = 0; j < melancias.length; j++){
        if (j != index) {
         let melaoTeste = melancias[j];
         if(bateuMelancia(melao,melaoTeste)){
            colideMelancias(melao,melaoTeste);   
            // if (melao.nome == melaoTeste.nome) {
            //     fusao(index, j);
            // }
         }
        }
    }
}

function fusao(index1, index2) {
    raio = melancias[index1].radius;
    x = melancias[index2].x;
    y = melancias[index2].y;
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
        new Melancia(mouseX - 50, 0, 50)
    );
    
})
