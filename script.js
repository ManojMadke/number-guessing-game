// Constants
const MAX_ATTEMPTS = 10;
const MAX_GUESS = 100;
const MIN_GUESS = 1;

// State Variables
let secretNumber = generateRandomNumber();
let attemptsLeft = MAX_ATTEMPTS;
let guessHistory = [];

// Dom Elements
const input = document.querySelector("#input");
const guessbtn = document.querySelector("#guess-btn");
const resulticon = document.querySelector("#result-icon");
const resulth1 = document.querySelector("#result-heading");
const attempts = document.querySelector("#attempts");
const history = document.querySelector("#history");
const resulttext = document.querySelector("#result-desc");
const restartBtn = document.querySelector("#restartBtn");
const icon = restartBtn.querySelector("i");

// Utility Function
function generateRandomNumber () {
    return Math.floor(Math.random() * (MAX_GUESS - MIN_GUESS + 1)) + MIN_GUESS;
}

function setResult(icon, heading, text, color) {
    resulticon.textContent = icon;
    resulticon.style.color = color;
    resulticon.style.borderColor = color;
    resulth1.textContent = heading;
    resulttext.textContent = text;
}

function setGameControls(disable) {
    input.disabled = disable;
    guessbtn.disabled = disable;
}

function setGuessStyle(element,color) {
    element.style.borderColor = color;
    element.style.color = color;
}

// Game logic
guessbtn.addEventListener("click", function() {
    const userGuess = Number(input.value.trim());

    if (input.value.trim() === "" || Number.isNaN(userGuess) || userGuess > MAX_GUESS || userGuess < MIN_GUESS) {
        setResult("!", "Invalid Guess", `Please enter a whole number between ${MIN_GUESS} and ${MAX_GUESS}.`, "#e74c3c");
        return;
    }else if (
        guessHistory.some(entry => entry.userGuess === userGuess)
    ){
        setResult("!", `You already guessed ${userGuess}.`, "Attempts not deducted.", "#e74c3c");
        return;
    }

    attemptsLeft--;
    attempts.textContent  = attemptsLeft;

    if (userGuess === secretNumber){
        guessHistory.push({userGuess, status: "correct"});
        setResult("🎉", "You got it!", `The number was ${secretNumber}.` ,"#2ecc71");
        setGameControls(true);
    }else if (attemptsLeft <= 0) {
        guessHistory.push({userGuess, status: userGuess < secretNumber ? "low" : "high"});
        setResult("✕", "Out of attempts!", `The number was ${secretNumber}. Better luck next time!`, "#e74c3c");
        setGameControls(true);
    }else if (userGuess > secretNumber) {
        guessHistory.push({userGuess, status: "high"});
        setResult( "↑", "Too high!", `Try a lower number. ${attemptsLeft} attempt left out of ${MAX_ATTEMPTS}`, "#e74c3c");
    } else {
        guessHistory.push({userGuess, status: "low"});
        setResult("↓", "Too low!", `Try a higher number. ${attemptsLeft} attempt left out of ${MAX_ATTEMPTS}`, "#f39c12");
    }

    renderHistory(guessHistory);
    input.value = "";
    input.focus();
});

// Enter Key Support
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !guessbtn.disabled) {
        guessbtn.click();
    }
});

// History Rendering
function renderHistory(guessHistory) {
    history.innerHTML = "";

    if (guessHistory.length === 0) {
        history.innerHTML = `
            <i class="fa-regular fa-clipboard" style="color: #1e90ff;"></i>
            <p>No guesses yet</p>`;
        return;
    }

    guessHistory.forEach(entry => {
        const value = document.createElement("span");
        value.classList.add("guessvalue");

        if (entry.status === "high") {
            value.textContent = "↑ " + entry.userGuess;
            setGuessStyle(value, "#e74c3c");
        } else if (entry.status === "low") {
            value.textContent = "↓ " + entry.userGuess;
            setGuessStyle(value, "#f39c12");
        } else {
            value.textContent = "✓ " + entry.userGuess;
            setGuessStyle(value, "#2ecc71");
        }
        history.appendChild(value);
    });
    history.scrollTop = history.scrollHeight;
}

// Restart Game
function restartGame() {
    secretNumber = generateRandomNumber();
    attemptsLeft = MAX_ATTEMPTS;
    guessHistory = [];

    attempts.textContent = attemptsLeft;
    input.value = "";
    input.focus();
    setGameControls(false);
    setResult("?", "Start guessing!", "Make a guess to see if you're too high or too low.", "rgb(200, 119, 232)");
    renderHistory(guessHistory);
}

// Restart Button Animation
restartBtn.addEventListener("click", () => {
    icon.classList.add("rotate");

    icon.addEventListener("animationend", () => {
        icon.classList.remove("rotate");
        restartGame();
    }, { once: true });
});