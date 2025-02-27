const wordDisplay = document.getElementById("word-display");
const livesDisplay = document.getElementById("lives");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");

const hangmanImage = document.getElementById("hangman-image");

const words = ["ARLEEDA"];
let selectedWord = "";
let hiddenWord = [];
let lives = 6;

// Update the image based on remaining lives
function updateHangmanImage() {
  hangmanImage.src = `img/hangman-${lives}.jpg`;
}

// Handle guesses
function handleGuess(char, keyElement) {
  keyElement.disabled = true;
  keyElement.classList.add("disabled");

  if (selectedWord.includes(char)) {
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === char) {
        hiddenWord[i] = char;
      }
    }
    wordDisplay.textContent = hiddenWord.join(" ");

    if (!hiddenWord.includes("_")) {
      message.innerHTML = "🎉 Betulll!! Pandainyaaa. Nah <a href='https://qw4ckk3r.github.io/ArleedaBirthday/'>hadiah</a> 🎉";

      endGame();
    }
  } else {
    lives--;
    livesDisplay.textContent = lives;
    updateHangmanImage();

    if (lives === 0) {
      message.textContent = `Main elok-elok la >:I`;
      endGame();
    }
  }
}

// Initialize the game
function initGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  hiddenWord = "_".repeat(selectedWord.length).split("");
  lives = 6;

  wordDisplay.textContent = hiddenWord.join(" ");
  livesDisplay.textContent = lives;
  message.textContent = "";
  updateHangmanImage();

  keyboard.innerHTML = "";
  for (let char of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    const key = document.createElement("button");
    key.textContent = char;
    key.classList.add("key");
    key.addEventListener("click", () => handleGuess(char, key));
    keyboard.appendChild(key);
  }

  restartButton.classList.add("hidden");
}

// End the game
function endGame() {
  for (let key of keyboard.children) {
    key.disabled = true;
  }
  restartButton.classList.remove("hidden");
}

// Start the game
initGame();
