const emojis = ["❤️", "🍕", "🎮", "🌟", "🐱", "🎶", "☕", "🌹"];
let cards = [];
const gameBoard = document.getElementById("gameBoard");
const winMessage = document.getElementById("winMessage");
const resetButton = document.getElementById("resetButton");
const showRankingButton = document.getElementById("showRankingButton");
const popupContainer = document.getElementById("popupContainer");
const popupOverlay = document.getElementById("popupOverlay");

let firstCard = null, secondCard = null;
let lockBoard = false, matchedPairs = 0;
let startTime, timerInterval, timerStarted = false; 

// Function to start the game
function startGame() {
    gameBoard.innerHTML = ""; // Clear board
    winMessage.style.display = "none"; // Hide win message
    popupContainer.style.display = "none"; // Hide popup
    popupOverlay.style.display = "none"; // Hide overlay
    matchedPairs = 0;
    firstCard = secondCard = null;
    lockBoard = false;

    // Timer setup
    clearInterval(timerInterval);
    startTime = new Date();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

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

// Update the timer
function updateTimer() {
    const elapsedTime = Math.floor((new Date() - startTime) / 1000);
    document.getElementById("timerDisplay").textContent = `Time: ${elapsedTime}s`;
}

// Flip card function
function flipCard() {
    if (lockBoard || this.classList.contains("flipped")) return;

    if (!timerStarted) {
        // Timer setup only after first card is flipped
        timerStarted = true;
        startTime = new Date();
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

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
            gameWon();
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

// Function when the game is won
function gameWon() {
    clearInterval(timerInterval);
    const finalTime = Math.floor((new Date() - startTime) / 1000);
    showPopup(finalTime);
}

// Show the popup
function showPopup(finalTime) {
    popupContainer.innerHTML = `
        <div class="popup-content">
            <h2>Pandainya awakkk!</h2>
            <p>Awak ambil maasaaa <strong>${finalTime} saat untuk siap!</strong>.</p>
            <div class="leaderboard-container">
                <h3>Current Leaderboard:</h3>
                <ol id="leaderboardList"></ol>
            </div>
            <p>Cuba letak nama:</p>
            <input type="text" id="playerName" placeholder="Nama anda" />
            <button id="submitScore">Submit Score</button>
            <button id="noButton">Taknok</button>
        </div>
    `;
    popupContainer.style.display = "flex";
    popupOverlay.style.display = "block";

    // Fetch leaderboard from CMS
    fetchLeaderboard();

    // Event Listeners
    document.getElementById("submitScore").addEventListener("click", function () {
        let playerName = document.getElementById("playerName").value;
        if (playerName) {
            submitScore(playerName, finalTime);
        } else {
            alert("Please enter your name!");
        }
    });

    document.getElementById("noButton").addEventListener("click", function () {
        popupContainer.style.display = "none";
        popupOverlay.style.display = "none";
    });
}

// Show the popup
function showPopup2() {
    popupContainer.innerHTML = `
        <div class="popup-content">
            <h2>Ini leaderboard top 5</h2>
            <div class="leaderboard-container">
                <h3>Current Leaderboard:</h3>
                <ol id="leaderboardList"></ol>
            </div>
            <button id="noButton">Tutup</button>
        </div>
    `;
    popupContainer.style.display = "flex";
    popupOverlay.style.display = "block";

    // Fetch leaderboard from CMS
    fetchLeaderboard();

    document.getElementById("noButton").addEventListener("click", function () {
        popupContainer.style.display = "none";
        popupOverlay.style.display = "none";
    });
}

// Fetch leaderboard from Google Sheets
function fetchLeaderboard() {
    fetch('https://script.google.com/macros/s/AKfycby4P6-qo2tjI-0ibyi7p5Bc_NcvPkZ-J2krdnliLiJ0ldenUvhG-1gRzz9KTOzhHyry/exec')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.innerHTML = "";
            if (data && Array.isArray(data)) {
                data.slice(0, 5).forEach(entry => {
                    const li = document.createElement("li");
                    li.textContent = `${entry.name} - ${entry.time}s`;
                    leaderboardList.appendChild(li);
                });
            } else {
                leaderboardList.innerHTML = "<li>Error fetching leaderboard</li>";
            }
        })
        .catch(error => {
            console.error("Error fetching leaderboard:", error);
            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.innerHTML = "<li>Error fetching leaderboard</li>";
        });
}

// Submit score to Google Sheets
function submitScore(name, time) {
    fetch('https://script.google.com/macros/s/AKfycby4P6-qo2tjI-0ibyi7p5Bc_NcvPkZ-J2krdnliLiJ0ldenUvhG-1gRzz9KTOzhHyry/exec', {
        method: "POST",
        body: JSON.stringify({ name: name, time: time })
    })
    .then(response => response.text())
    .then(() => {
        popupContainer.style.display = "none";
        popupOverlay.style.display = "none";
    })
    .catch(error => {
        console.error("Error submitting score:", error);
        alert("There was an error submitting your score. Please try again later.");
    });
}

// Show leaderboard button event listener
showRankingButton.addEventListener("click", function() {
    showPopup2(); 
});

// Reset button event listener
resetButton.addEventListener("click", startGame);

// Start the game on page load
startGame();
