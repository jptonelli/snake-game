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

const $areaJogo = $('#areaJogo');
const $divPontuacao = $('#pontuacao');
const $divGameOver = $('#fimDeJogo');
const $textoPontuacaoFinal = $('#pontuacaoFinal');

$(document).on('keydown', mudarDirecao);

function iniciarJogo() {
    cobrinha = [{ x: 10 * tamanho, y: 10 * tamanho }];
    direcao = 'direita';
    pontos = 0;
    velocidade = 150;
    obstaculos = gerarObstaculos(8);
    gerarComida();
    atualizarPontuacao();
    $divGameOver.hide();
    $areaJogo.empty();
    clearInterval(intervaloDeJogo);
    intervaloDeJogo = setInterval(desenhar, velocidade);
}

function mudarDirecao(evento) {
    const keyCode = evento.which || evento.keyCode;
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
    $divPontuacao.text('Pontuação: ' + pontos);
}

function desenhar() {
    $areaJogo.empty();

    obstaculos.forEach(o => {
        $('<div>')
            .addClass('obstaculo parte')
            .css({ left: o.x + 'px', top: o.y + 'px' })
            .appendTo($areaJogo);
    });

    cobrinha.forEach((parte, index) => {
        $('<div>')
            .addClass('parte')
            .toggleClass('cabeca', index === 0)
            .css({ left: parte.x + 'px', top: parte.y + 'px' })
            .appendTo($areaJogo);
    });

    $('<div>')
        .addClass('parte comida')
        .css({ left: comida.x + 'px', top: comida.y + 'px' })
        .appendTo($areaJogo);

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
        $textoPontuacaoFinal.text('Sua pontuação foi: ' + pontos);
        $divGameOver.show();
        return;
    }

    cobrinha.unshift(novaCabeca);
}

function verificarColisao(posicao, array) {
    return array.some(p => p.x === posicao.x && p.y === posicao.y);
}

iniciarJogo();