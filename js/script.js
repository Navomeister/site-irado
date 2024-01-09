// variaveis css
const root = document.querySelector(":root");
const rootStyles = getComputedStyle(root);
// console.log(rootStyles.getPropertyValue("--primary-color"));
// ***

// https://www.youtube.com/watch?v=Zdicf60eNzA
const canvas = document.getElementById("divertido");
const ctx = canvas.getContext("2d");

// parte que mexe com a pontuação --------------------------
var clique = false;

var pontuacao = 0;
const txtPontos = document.getElementById("pontos");

function aumentaPonto(valor, multiplicador) {
    let pontosFusao = valor * multiplicador
    pontuacao += pontosFusao;
    txtPontos.innerText = pontuacao.toString() + " pontos";
}

var multiplicador = 1;
// ----------------------------------------------------------

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
        this.mass = 25;
        this.x = x;
        this.y = y;
        switch (raio) {
            case 50:
                this.nome = "melao";
                this.sprite = melancia;
                this.proxRaio = 75;
                this.valor = 250;
                break;

            case 75:
                this.nome = "morando";
                this.sprite = melancia;
                this.proxRaio = 100;
                this.valor = 500;
                break;
        
            default:
                this.nome = "melancia";
                this.sprite = melancia;
                this.proxRaio = 50;
                this.valor = 100;
                break;
        }
        this.dx = 0;
        
        this.dy = Math.sin(-100) * 15;
        this.gravity = 0.05;
        this.friction = 0.015;
    }

    move(){
        if (this.y + this.gravity < 580) {
            this.dy +=  this.gravity;
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

// função de animação do canvas :D
function animate() {
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

// checa se bateu na parede tendo em conta o tamanho do canvas, o offset até a parede (apnas no x) e a espessura da parede
function bateuParede(melancia) {
    if (melancia.y + melancia.radius * 2 >= canvas.height - 20 ||
        melancia.x < 40 || 
        melancia.x + melancia.radius * 2 > canvas.width - 40) {
        if (melancia.y + melancia.radius * 2 >= canvas.height - 20){
            melancia.y = canvas.height - 20 - melancia.radius * 2;
            melancia.dy = 0;
        }
        if (melancia.x + melancia.radius * 2 > canvas.width - 40) {
            melancia.x = canvas.width - 40 - melancia.radius * 2;
            melancia.dx *= -1;
        }
        if (melancia.x < 40) {
            melancia.x = 40;
            melancia.dx *= -1;
        }
    }
}

function bateuMelancia(melao1, melao2) {
    // agora preciso arrumar aqui, do jeito que tava a colisão entre mesmo raio funciona, mas colisão entre diferentes raios está deslocada
    // dar um jeito de o cálculo servir pra isso, não sei como ainda
    let collision = false;
    let dx = (melao1.x + melao1.radius) - (melao2.x + melao2.radius);
    let dy = (melao1.y + melao1.radius) - (melao2.y + melao2.radius);
    //Modified pythagorous, because sqrt is slow
    let distance = (dx * dx + dy * dy);
    if(distance <= (melao1.radius + melao2.radius)*(melao1.radius + melao2.radius)){
        collision = true;
    }
    return collision;
}

function colideMelancias(melao1,melao2){
    // Pega a diferença exata entre os dois melao
    let dx = (melao2.x + melao2.radius) - (melao1.x + melao1.radius);
    let dy = (melao2.y + melao2.radius) - (melao1.y + melao2.radius);
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
}


function collide(index) {
    let melao = melancias[index];
    let cai = true;
    for(let j = 0; j < melancias.length; j++){
        if (j != index) {
            let melaoTeste = melancias[j];
            if(bateuMelancia(melao,melaoTeste)){
                // ainda treme mas agora não sei o motivo :D
                cai = false;
                colideMelancias(melao,melaoTeste);   
                if (melao.nome == melaoTeste.nome) {
                    clique = false;
                    aumentaPonto(melao.valor, multiplicador);
                    multiplicador++;
                    fusao(index, j);
                }
                else {
                    if (clique) {
                        clique = false;
                        multiplicador = 1;
                    }
                }
         }
        }
    }
    if (multiplicador > 1) {
        txtPontos.classList = "rainbow_text_animated";
    }
    else {
        txtPontos.classList = "";
    }
    if (!cai) {
        melao.dy -= melao.gravity;
    }
}

function fusao(index1, index2) {
    primIndex = index1;
    segIndex = index2;
    raio = melancias[primIndex].radius;
    proxRaio = melancias[segIndex].proxRaio;
    x = melancias[segIndex].x;
    y = melancias[segIndex].y;
    melancias.splice(primIndex, 1);
    if (primIndex < segIndex) {
        segIndex--;
    }
    melancias.splice(segIndex, 1);
    melancias.push(
        new Melancia(x, y, proxRaio)
    );
}

canvas.addEventListener("click", e => {
    clique = true;
    mouseX = e.clientX - canvas.offsetLeft;
    clickCont++;
    melancias.push(
        new Melancia(mouseX - 25, 0, 25)
    );
    
})

// para teste, coloca uma melancia maior no ultimo lugar clicado
document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case "q":
            melancias.push(
                new Melancia(mouseX - 50, 0, 50)
            );
            break;

        case "w":
            melancias.push(
                new Melancia(mouseX - 75, 0, 75)
            );
            break;
    
        default:
            break;
    }
})
