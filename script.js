const areaJogo = document.getElementById('areaJogo');
const divPontuacao = document.getElementById('pontuacao');
const divGameOver = document.getElementById('fimDeJogo');
const textoPontuacaoFinal = document.getElementById('pontuacaoFinal');

const tamanho = 20;
let cobrinha;
let comida;
let direcao;
let pontos;
let velocidade;
let intervaloDeJogo;
let obstaculos;

const somComer = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
const somBater = new Audio('https://www.fesliyanstudios.com/play-mp3/696');

document.addEventListener('keydown', mudarDirecao);

function iniciarJogo() {
    cobrinha = [{ x: 10 * tamanho, y: 10 * tamanho }];
    direcao = 'direita';
    pontos = 0;
    velocidade = 150;
    obstaculos = gerarObstaculos(8);
    gerarComida();
    atualizarPontuacao();
    divGameOver.style.display = 'none';
    areaJogo.innerHTML = '';
    clearInterval(intervaloDeJogo);
    intervaloDeJogo = setInterval(desenhar, velocidade);
}

function mudarDirecao(evento) {
    const keyCode = evento.keyCode;
    if (keyCode === 37 && direcao !== 'direita') direcao = 'esquerda';
    if (keyCode === 38 && direcao !== 'baixo') direcao = 'cima';
    if (keyCode === 39 && direcao !== 'esquerda') direcao = 'direita';
    if (keyCode === 40 && direcao !== 'cima') direcao = 'baixo';
}


function gerarComida() {
    let valido = false;
    let novaComida;
    while (!valido) {
        novaComida = {
            x: Math.floor(Math.random() * 30) * tamanho,
            y: Math.floor(Math.random() * 30) * tamanho
        };
        if (
            !verificarColisao(novaComida, cobrinha) &&
            !verificarColisao(novaComida, obstaculos)
        ) {
            valido = true;
        }
    }
    comida = novaComida;
}

function gerarObstaculos(quantidade) {
    const obs = [];
    while (obs.length < quantidade) {
        const ob = {
            x: Math.floor(Math.random() * 30) * tamanho,
            y: Math.floor(Math.random() * 30) * tamanho
        };
        if (
            !verificarColisao(ob, obs) &&
            !(ob.x === 10 * tamanho && ob.y === 10 * tamanho)
        ) {
            obs.push(ob);
        }
    }
    return obs;
}

function atualizarPontuacao() {
    divPontuacao.textContent = 'Pontuação: ' + pontos;
}

function desenhar() {
    areaJogo.innerHTML = '';

    obstaculos.forEach(o => {
        const ob = document.createElement('div');
        ob.classList.add('obstaculo');
        ob.style.left = o.x + 'px';
        ob.style.top = o.y + 'px';
        ob.classList.add('parte');
        areaJogo.appendChild(ob);
    });

    cobrinha.forEach((parte, index) => {
        const elemento = document.createElement('div');
        elemento.classList.add('parte');
        if (index === 0) elemento.classList.add('cabeca');
        elemento.style.left = parte.x + 'px';
        elemento.style.top = parte.y + 'px';
        areaJogo.appendChild(elemento);
    });

    const comidaElemento = document.createElement('div');
    comidaElemento.classList.add('parte', 'comida');
    comidaElemento.style.left = comida.x + 'px';
    comidaElemento.style.top = comida.y + 'px';
    areaJogo.appendChild(comidaElemento);

    cobrinha.forEach((parte, index) => {
        const elemento = document.createElement('div');
        elemento.classList.add('parte');
        if (index === 0) elemento.classList.add('cabeca');
        elemento.style.left = parte.x + 'px';
        elemento.style.top = parte.y + 'px';
        areaJogo.appendChild(elemento);
    });

    let cabecaX = cobrinha[0].x;
    let cabecaY = cobrinha[0].y;

    if (direcao === 'direita') cabecaX += tamanho;
    if (direcao === 'esquerda') cabecaX -= tamanho;
    if (direcao === 'cima') cabecaY -= tamanho;
    if (direcao === 'baixo') cabecaY += tamanho;

    if (cabecaX === comida.x && cabecaY === comida.y) {
        somComer.play();
        pontos++;
        atualizarPontuacao();
        gerarComida();

        if (pontos % 5 === 0 && velocidade > 50) {
            velocidade -= 10;
            clearInterval(intervaloDeJogo);
            intervaloDeJogo = setInterval(desenhar, velocidade);
        }
    } else {
        cobrinha.pop();
    }

    const novaCabeca = { x: cabecaX, y: cabecaY };

    if (cabecaX < 0 || cabecaY < 0 || cabecaX >= 600 || cabecaY >= 600 || verificarColisao(novaCabeca, cobrinha) || verificarColisao(novaCabeca, obstaculos)) {
        somBater.play();
        clearInterval(intervaloDeJogo);
        textoPontuacaoFinal.textContent = 'Sua pontuação foi: ' + pontos;
        divGameOver.style.display = 'block';
        return;
    }

    cobrinha.unshift(novaCabeca);
}

function verificarColisao(posicao, array) {
    return array.some(p => p.x === posicao.x && p.y === posicao.y);
}

iniciarJogo();
