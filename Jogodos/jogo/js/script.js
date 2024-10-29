class SlidingPuzzle {
    constructor() {
        this.tiles = [];
        this.answer = [];
        this.timerInterval = null;
        this.gameState = {
            isPlaying: false,
            startTime: null
        };

        // DOM Elements
        this.elements = {
            container: document.querySelector("#container"),
            intro: document.querySelector("#intro"),
            gameOver: document.querySelector("#gameOver"),
            timerDisplay: document.querySelector("#timerDisplay")
        };

        // Game constants
        this.GRID_SIZE = 3;
        this.TOTAL_TILES = this.GRID_SIZE * this.GRID_SIZE - 1;

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);
        this.startGame = this.startGame.bind(this);

        // Initialize
        this.initializeGame();
    }

    initializeGame() {
        this.initializeTiles();
        this.setupEventListeners();
        this.handleResize();
    }

    initializeTiles() {
        for (let i = 1; i <= this.TOTAL_TILES; i++) {
            const tile = document.querySelector(`#n${i}`);
            tile.addEventListener("click", this.handleTileClick);
            this.tiles.push(tile);
        }
        this.tiles.push(null); // Empty tile
        this.answer = [...this.tiles];
    }

    setupEventListeners() {
        window.addEventListener("resize", this.handleResize);
        this.elements.intro.addEventListener("click", this.startGame);
    }

    handleResize() {
        const { innerWidth: width, innerHeight: height } = window;
        const BASE = Math.min(width, height) * 0.95;
        const TILE_SIZE = BASE * 0.32;

        // Update container size
        Object.assign(this.elements.container.style, {
            width: `${BASE}px`,
            height: `${BASE}px`,
            left: `${BASE * 0.025}px`
        });

        // Update tiles size
        this.tiles.forEach(tile => {
            if (tile) {
                Object.assign(tile.style, {
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`
                });
            }
        });

        this.renderBoard(BASE, TILE_SIZE);
    }

    renderBoard(BASE, TILE_SIZE) {
        const space = (BASE - (3 * TILE_SIZE)) / 4;
        
        this.tiles.forEach((tile, index) => {
            if (!tile) return;

            const row = Math.floor(index / 3);
            const col = index % 3;

            Object.assign(tile.style, {
                top: `${space + (row * (TILE_SIZE + space))}px`,
                left: `${space + (col * (TILE_SIZE + space))}px`,
                transition: 'top 0.3s ease, left 0.3s ease'
            });
        });
    }

    startGame() {
        this.gameState.isPlaying = true;
        this.tiles = this.shuffleTiles(this.tiles);
        this.updateGameScreen('start');
        this.startTimer();
    }

    shuffleTiles(tiles) {
        let shuffled;
        do {
            shuffled = [...tiles].sort(() => Math.random() - 0.5);
        } while (!this.isValidConfiguration(shuffled));
        return shuffled;
    }

    isValidConfiguration(tiles) {
        let inversions = 0;
        for (let i = 0; i < tiles.length - 1; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i] && tiles[j] && 
                    parseInt(tiles[i].id.slice(1)) > parseInt(tiles[j].id.slice(1))) {
                    inversions++;
                }
            }
        }
        return inversions % 2 === 0;
    }

    handleTileClick(event) {
        if (!this.gameState.isPlaying) return;

        const index = this.tiles.indexOf(event.target);
        const movements = this.getValidMoves(index);

        for (const newIndex of movements) {
            if (this.tiles[newIndex] === null) {
                this.moveTile(index, newIndex);
                break;
            }
        }

        if (this.checkWinCondition()) {
            this.endGame();
        }
    }

    getValidMoves(index) {
        const moves = [];
        
        // Left
        if (index % 3 !== 0) moves.push(index - 1);
        // Right
        if (index % 3 !== 2) moves.push(index + 1);
        // Up
        if (index > 2) moves.push(index - 3);
        // Down
        if (index < 6) moves.push(index + 3);

        return moves;
    }

    moveTile(fromIndex, toIndex) {
        [this.tiles[fromIndex], this.tiles[toIndex]] = [this.tiles[toIndex], this.tiles[fromIndex]];
        this.handleResize(); // Re-render board
    }

    checkWinCondition() {
        return this.tiles.every((tile, index) => tile === this.answer[index]);
    }

    startTimer() {
        this.gameState.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const elapsed = Date.now() - this.gameState.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.elements.timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateGameScreen(state) {
        const screens = {
            start: () => {
                Object.assign(this.elements.intro.style, {
                    opacity: '0',
                    display: 'none'
                });
                Object.assign(this.elements.gameOver.style, {
                    opacity: '0',
                    display: 'none',
                    zIndex: '-1'
                });
                this.elements.container.style.display = 'block';
            },
            end: () => {
                Object.assign(this.elements.gameOver.style, {
                    opacity: '1',
                    display: 'block',
                    zIndex: '5'
                });
                this.elements.gameOver.addEventListener('click', this.startGame);
            }
        };

        screens[state]();
    }

    endGame() {
        this.gameState.isPlaying = false;
        clearInterval(this.timerInterval);
        this.updateGameScreen('end');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlidingPuzzle();
});