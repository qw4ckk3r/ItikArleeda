const emojis = ["❤️", "🍕", "🎮", "🌟", "🐱", "🎶", "☕", "🌹"];
let cards = [];
const gameBoard = document.getElementById("gameBoard");
const winMessage = document.getElementById("winMessage");
const resetButton = document.getElementById("resetButton");

let firstCard = null, secondCard = null;
let lockBoard = false, matchedPairs = 0;

// Function to start the game
function startGame() {
    gameBoard.innerHTML = ""; // Clear board
    winMessage.style.display = "none"; // Hide win message
    matchedPairs = 0;
    firstCard = secondCard = null;
    lockBoard = false;

    // Duplicate and shuffle cards
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    // Create new shuffled cards
    cards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = "❓";
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip card function
function flipCard() {
    if (lockBoard || this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.innerHTML = this.dataset.emoji;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// Check for match
function checkForMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        matchedPairs++;
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
        if (matchedPairs === emojis.length) {
            winMessage.style.display = "block";
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerHTML = "❓";
            secondCard.innerHTML = "❓";
            resetBoard();
        }, 1000);
    }
}

// Reset selection
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Reset button event listener
resetButton.addEventListener("click", startGame);

// Start the game on page load
startGame();
