document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 8;
    const mineCount = 10;
    let board = [];
    let gameOver = false;

    const boardElement = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");
    const messageElement = document.getElementById("message");

    function createBoard() {
        board = [];
        gameOver = false;
        messageElement.textContent = "";

        boardElement.innerHTML = "";
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

        for (let r = 0; r < boardSize; r++) {
            board[r] = [];
            for (let c = 0; c < boardSize; c++) {
                board[r][c] = { mine: false, revealed: false, count: 0 };
                
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                cell.addEventListener("click", () => revealTile(r, c));
                
                boardElement.appendChild(cell);
            }
        }

        placeMines();
        calculateNumbers();
    }

    function placeMines() {
        let placed = 0;
        while (placed < mineCount) {
            let r = Math.floor(Math.random() * boardSize);
            let c = Math.floor(Math.random() * boardSize);
            if (!board[r][c].mine) {
                board[r][c].mine = true;
                placed++;
            }
        }
    }

    function calculateNumbers() {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c].mine) continue;

                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        let nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc].mine) {
                            count++;
                        }
                    }
                }
                board[r][c].count = count;
            }
        }
    }

    function revealTile(row, col) {
        if (gameOver || board[row][col].revealed) return;

        let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        board[row][col].revealed = true;
        cell.classList.add("revealed");

        if (board[row][col].mine) {
            cell.classList.add("mine");
            cell.textContent = "🐱";  // Cat instead of bomb
            gameOver = true;
            messageElement.textContent = "Oh no! You found a cat! 🐱💥";
            revealAllMines();
            return;
        }

        if (board[row][col].count > 0) {
            cell.textContent = board[row][col].count;
        } else {
            revealSurroundingTiles(row, col);
        }

        checkWin();
    }

    function revealSurroundingTiles(row, col) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = row + dr, nc = col + dc;
                if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && !board[nr][nc].revealed) {
                    revealTile(nr, nc);
                }
            }
        }
    }

    function revealAllMines() {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c].mine) {
                    let cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add("mine");
                    cell.textContent = "🐱";  
                }
            }
        }
    }

    function checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c].revealed) revealedCount++;
            }
        }

        if (revealedCount === boardSize * boardSize - mineCount) {
            messageElement.textContent = "Yayy, awak elak semua oyennn";
            gameOver = true;
        }
    }

    restartButton.addEventListener("click", createBoard);
    
    createBoard();
});
