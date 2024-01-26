const botaoSuika = document.getElementById("botaoSuika");
const setaSuika = botaoSuika.getElementsByClassName("icone")[0];
const divSuika = document.getElementById("divSuika");

botaoSuika.addEventListener("click", (e) => {
    someDiv(divSuika);
})



function someDiv(div) {
    if (div.classList.contains("semDisplay")) {
        rotate(setaSuika, -180);
        setTimeout(() => {
            div.classList = '';
        }, 990);
        div.classList = 'apareceDiv';
    }
    else {
        rotate(setaSuika, 0);
        setTimeout(() => {
            div.classList = 'semDisplay';
        }, 990);
        div.classList = 'someDiv';
    }
}

async function rotate (element, degrees) {
    element.style.transitionDuration = '1s';
    element.style.transform = 'rotate('+ degrees +'deg)';
}