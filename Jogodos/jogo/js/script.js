var container;
var WIDTH, HEIGHT, BASE;
var tiles = [];
var answer = [];
var intro = document.querySelector("#intro");
var gameOverScreen = document.querySelector("#gameOver");
var timerInterval;
var timerDisplay = document.createElement("div");
timerDisplay.id = "timerDisplay";
document.body.appendChild(timerDisplay);

window.addEventListener("resize", resizeElements, false);
intro.addEventListener("click", startGame, false);

function init() {
    getTiles();
    resizeElements();
}

function getTiles() {
    for (var i = 1; i < 9; i++) {
        var tile = document.querySelector("#n" + i);
        tile.addEventListener("click", moveTile, false);
        tiles.push(tile);
    }
    tiles.push(null);
    answer = tiles;
}

function resizeElements() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    BASE = WIDTH < HEIGHT ? Math.floor(WIDTH * 0.95) : Math.floor(HEIGHT * 0.95);
    TILE = BASE * 0.32;

    container = document.querySelector("#container");
    container.style.width = BASE + "px";
    container.style.height = BASE + "px";
    container.style.left = BASE * 0.025 + "px";

    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i]) {
            tiles[i].style.width = TILE + "px";
            tiles[i].style.height = TILE + "px";
        }
    }

    renderGame(tiles);
}

function startGame() {
    tiles = randomSort(tiles);
    renderGame(tiles);
    intro.style.opacity = "0";
    gameOverScreen.style.opacity = "0";
    gameOverScreen.removeEventListener("click", startGame, false);
    setTimeout(function () {
        intro.style.display = "none";
        gameOverScreen.style.display = "none";
        gameOverScreen.style.zIndex = "-1";
    }, 500);
    container.style.display = "initial";
    startTimer(); // Inicia o cronômetro quando o jogo começa
}

function randomSort(oldArray) {
    var newArray;
    do {
        newArray = [];

        while (newArray.length < oldArray.length) {
            var i = Math.floor(Math.random() * oldArray.length);
            if (newArray.indexOf(oldArray[i]) < 0) {
                newArray.push(oldArray[i]);
            }
        }
    } while (!validTiles(newArray));

    return newArray;
}

function validTiles(array) {
    var inversions = 0;
    var len = array.length;

    for (var i = 0; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            if (array[i] && array[j] && array[i].id > array[j].id) {
                inversions++;
            }
        }
    }

    return inversions % 2 === 0;
}

function renderGame() {
    var space = (BASE - (3 * TILE)) / 4;
    for (i = 0; i < tiles.length; i++) {
        if (tiles[i]) {
            var peca = tiles[i];
            if (i < 3) {
                peca.style.top = space + "px";
            } else if (i < 6) {
                peca.style.top = TILE + (space * 2) + "px";
            } else {
                peca.style.top = (TILE * 2) + (space * 3) + "px";
            }
            if (i % 3 === 0) {
                peca.style.left = space + "px";
            } else if (i % 3 === 1) {
                peca.style.left = TILE + (space * 2) + "px";
            } else {
                peca.style.left = (TILE * 2) + (space * 3) + "px";
            }
        }
    }
}

function checkWinning() {
    for (var i in tiles) {
        var t = tiles[i];
        var a = answer[i];
        if (t !== a) {
            return false;
        }
    }
    return true;
}

function gameOver() {
    gameOverScreen.style.opacity = "1";
    setTimeout(function () {
        gameOverScreen.style.zIndex = "5";
        gameOverScreen.style.display = "initial";
        gameOverScreen.addEventListener("click", startGame, false);
    }, 500);
    pauseTimer(); // Pausa o cronômetro quando o jogo termina
}

function moveTile() {
    var index = tiles.indexOf(this);

    if (index % 3 !== 0) {
        if (!tiles[index - 1]) {
            tiles[index - 1] = tiles[index];
            tiles[index] = null;
        }
    }
    if ((index % 3) !== 2) {
        if (!tiles[index + 1]) {
            tiles[index + 1] = tiles[index];
            tiles[index] = null;
        }
    }
    if (index > 2) {
        if (!tiles[index - 3]) {
            tiles[index - 3] = tiles[index];
            tiles[index] = null;
        }
    }
    if (index < 6) {
        if (!tiles[index + 3]) {
            tiles[index + 3] = tiles[index];
            tiles[index] = null;
        }
    }
    renderGame();
    if (checkWinning()) {
        gameOver();
    }
}

function startTimer() {
    var startTime = Date.now();
    timerInterval = setInterval(function () {
        var elapsedTime = Date.now() - startTime;
        var seconds = Math.floor((elapsedTime / 1000) % 60);
        var minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        var hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        timerDisplay.textContent =
            (hours > 9 ? hours : "0" + hours) + ":" +
            (minutes > 9 ? minutes : "0" + minutes) + ":" +
            (seconds > 9 ? seconds : "0" + seconds);
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

window.onload = function () {
    init();
}
