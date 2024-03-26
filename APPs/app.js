const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restartButton");
const gameMessage = document.getElementById("gameMessage"); // Message element
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let coconutTurn = true;

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
    cells.forEach((cell) => {
        cell.classList.remove("coconut", "starfish");
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });
    gameMessage.textContent = ''; // Clear the message at the start of the game
    coconutTurn = true; // Reset the turn to coconut at the start
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = coconutTurn ? "coconut" : "starfish";
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function endGame(draw) {
    if (draw) {
        gameMessage.textContent = "Draw!";
    } else {
        gameMessage.textContent = `${coconutTurn ? "Coconut" : "Starfish"} Wins!`;
    }
    // Delay the restart of the game to allow the message to be read
    setTimeout(startGame, 3000);
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains("coconut") || cell.classList.contains("starfish");
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    coconutTurn = !coconutTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

console.log("Script loaded successfully");
