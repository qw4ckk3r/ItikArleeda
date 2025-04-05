let userChoice;
let computerChoice;
let result;
let winStreak = 0;

const choices = ['rock', 'paper', 'scissors'];

const userChoiceDisplay = document.getElementById('user-choice');
const computerChoiceDisplay = document.getElementById('computer-choice');
const resultDisplay = document.getElementById('result');
const winStreakDisplay = document.getElementById('win-streak');
const showRankingButton = document.getElementById("showRankingButton");
const popupContainer = document.getElementById("popupContainer");
const popupOverlay = document.getElementById("popupOverlay");

// Helper: Update Win Streak
function updateWinStreak() {
    winStreakDisplay.textContent = `Win Streak: ${winStreak}`;
}

// Game Result Logic
function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) return "wau seri";
    if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'scissors' && computerChoice === 'paper') ||
        (userChoice === 'paper' && computerChoice === 'rock')
    ) return "Uyooo menangggg";
    return "Cuba lagi~";
}

// Main Play Function
function playGame(choice) {
    userChoice = choice;
    computerChoice = getComputerChoice();
    userChoiceDisplay.textContent = `Awak pilih: ${userChoice}`;
    computerChoiceDisplay.textContent = `Computer pilih: ${computerChoice}`;
    result = determineWinner(userChoice, computerChoice);
    resultDisplay.textContent = result;

    if (result === 'Uyooo menangggg') {
        winStreak++;
    } else if (result === 'Cuba lagi~') {
        showPopup(winStreak);
        winStreak = 0;
    }

    updateWinStreak();
}

// Get Random Computer Choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// POPUP when lose
function showPopup(finalScore) {
    popupContainer.innerHTML = `
        <div class="popup-content">
            <h2>dah kalahhh!</h2>
            <p>Winstreak awak: <strong>${finalScore}</strong></p>
            <div class="leaderboard-container">
                <h3>Leaderboard:</h3>
                <ol id="leaderboardList"></ol>
            </div>
            <p>Letak nama anda: </p>
            <input type="text" id="playerName" placeholder="Nama orang cantik" />
            <p>jangan submit kalau 0 tau hehe</p>
            <button id="submitScore">Submit Streak!</button>
            <button id="noButton">Tutup</button>
        </div>
    `;
    popupContainer.style.display = "flex";
    popupOverlay.style.display = "block";

    fetchLeaderboard();

    document.getElementById("submitScore").addEventListener("click", function () {
        const playerName = document.getElementById("playerName").value;
        if (playerName) {
            submitScore(playerName, finalScore);
        } else {
            alert("Please enter your name!");
        }
    });

    document.getElementById("noButton").addEventListener("click", function () {
        popupContainer.style.display = "none";
        popupOverlay.style.display = "none";
    });
}

// Show just the leaderboard
function showPopup2() {
    popupContainer.innerHTML = `
        <div class="popup-content">
            <h2>Top 5 Leaderboard</h2>
            <div class="leaderboard-container">
                <h3>Current Leaderboard:</h3>
                <ol id="leaderboardList"></ol>
            </div>
            <button id="noButton">Tutup</button>
        </div>
    `;
    popupContainer.style.display = "flex";
    popupOverlay.style.display = "block";

    fetchLeaderboard();

    document.getElementById("noButton").addEventListener("click", function () {
        popupContainer.style.display = "none";
        popupOverlay.style.display = "none";
    });
}

function fetchLeaderboard() {
    fetch('https://script.google.com/macros/s/AKfycbyQi8_tGTmx8lRhNhXvoWwZEYdjOWf09QabHpYm7wmgPpJWKfcK5CnXAWyrl6JRiGPqIw/exec')
        .then(response => response.json())
        .then(data => {
            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid data format");
            }

            // Convert to numbers safely (assuming 'score' is used instead of 'time')
            const cleaned = data.map(entry => ({
                name: entry.name,
                score: Number(entry.score)  // Use the score (win streak) directly
            })).filter(entry => !isNaN(entry.score));  // Filter out any invalid numbers

            // Sort in descending order (highest to lowest score)
            const sorted = cleaned.sort((a, b) => b.score - a.score);

            // Get the top 5 elements (1 to 5, descending order)
            const topFive = sorted.slice(0, 5);

            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.innerHTML = "";

            topFive.forEach(entry => {
                const li = document.createElement("li");
                li.textContent = `${entry.name} - ${entry.score} Streak!`; // Display name and score (win streak)
                leaderboardList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Leaderboard error:", error);
            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.innerHTML = "<li>Error fetching leaderboard</li>";
        });
}

// Submit score
function submitScore(name, score) {
    fetch('https://script.google.com/macros/s/AKfycbyQi8_tGTmx8lRhNhXvoWwZEYdjOWf09QabHpYm7wmgPpJWKfcK5CnXAWyrl6JRiGPqIw/exec', {
        method: "POST",
        body: JSON.stringify({ name: name, score: score })  // Submit the score (win streak)
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

// Button listeners
document.getElementById('rock').addEventListener('click', () => playGame('rock'));
document.getElementById('paper').addEventListener('click', () => playGame('paper'));
document.getElementById('scissors').addEventListener('click', () => playGame('scissors'));
showRankingButton.addEventListener("click", showPopup2);
