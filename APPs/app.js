document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restartButton");
    const gameMessage = document.getElementById("gameMessage");
    const playerModeButtons = document.querySelectorAll(".player-mode");
    const modeIndicator = document.querySelector(".mode-indicator");
    const bgMusic = document.getElementById("bgMusic");
    let gameMode = "human";
    let coconutTurn = true;

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

    bgMusic.volume = 0.2;

    function playMusic() {
        if (bgMusic.paused) {
            bgMusic
                .play()
                .catch((e) => console.error("Error playing music:", e));
            document.removeEventListener("click", playMusic);
        }
    }
    document.addEventListener("click", playMusic);

    function startGame() {
        cells.forEach((cell) => {
            cell.classList.remove("coconut", "starfish");
            cell.removeEventListener("click", handleClick);
            cell.addEventListener("click", handleClick, { once: true });
        });
        gameMessage.textContent = "";
        coconutTurn = true;
        updateModeIndicator();
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
            if (gameMode === "computer" && !coconutTurn) {
                setTimeout(makeComputerMove, 500);
            }
        }
    }

    function endGame(draw) {
        if (draw) {
            gameMessage.textContent = "Draw!";
        } else {
            gameMessage.textContent = `${
                coconutTurn ? "Coconut" : "Starfish"
            } Wins!`;
        }
        setTimeout(startGame, 3000);
    }

    function isDraw() {
        return [...cells].every(
            (cell) =>
                cell.classList.contains("coconut") ||
                cell.classList.contains("starfish")
        );
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }

    function swapTurns() {
        coconutTurn = !coconutTurn;
    }

    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some((combination) =>
            combination.every((index) =>
                cells[index].classList.contains(currentClass)
            )
        );
    }

    function makeComputerMove() {
        if (!tryToWin() && !blockOpponent() && !takeCenter() && !takeCorner()) {
            makeRandomMove();
        }

        let win = checkWin("starfish");
        let draw = isDraw();
        if (win) {
            endGame(false);
            return;
        } else if (draw) {
            endGame(true);
            return;
        }
        swapTurns();
    }

    function tryToWin() {
        return tryMove("starfish");
    }

    function blockOpponent() {
        return tryMove("coconut");
    }

    function tryMove(playerClass) {
        for (let [a, b, c] of WINNING_COMBINATIONS) {
            if (
                cells[a].classList.contains(playerClass) &&
                cells[b].classList.contains(playerClass) &&
                !cells[c].classList.contains("coconut") &&
                !cells[c].classList.contains("starfish")
            ) {
                cells[c].classList.add("starfish");
                return true;
            }
            if (
                cells[a].classList.contains(playerClass) &&
                !cells[b].classList.contains("coconut") &&
                !cells[b].classList.contains("starfish") &&
                cells[c].classList.contains(playerClass)
            ) {
                cells[b].classList.add("starfish");
                return true;
            }
            if (
                !cells[a].classList.contains("coconut") &&
                !cells[a].classList.contains("starfish") &&
                cells[b].classList.contains(playerClass) &&
                cells[c].classList.contains(playerClass)
            ) {
                cells[a].classList.add("starfish");
                return true;
            }
        }
        return false;
    }

    function takeCenter() {
        if (
            !cells[4].classList.contains("coconut") &&
            !cells[4].classList.contains("starfish")
        ) {
            cells[4].classList.add("starfish");
            return true;
        }
        return false;
    }

    function takeCorner() {
        const corners = [0, 2, 6, 8];
        for (let index of corners) {
            if (
                !cells[index].classList.contains("coconut") &&
                !cells[index].classList.contains("starfish")
            ) {
                cells[index].classList.add("starfish");
                return true;
            }
        }
        return false;
    }

    function makeRandomMove() {
        const emptyCells = Array.from(cells).filter(
            (cell) =>
                !cell.classList.contains("coconut") &&
                !cell.classList.contains("starfish")
        );
        if (emptyCells.length > 0) {
            const randomCell =
                emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.classList.add("starfish");
            return true;
        }
        return false;
    }

    playerModeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            gameMode = e.target.getAttribute("data-mode");
            if (gameMode === "computer") {
                document.addEventListener("click", playMusic, { once: true });
            }
            startGame();
        });
    });

    function updateModeIndicator() {
        modeIndicator.textContent = `Current Mode: ${
            gameMode === "human" ? "kanaka vs kanaka" : "kanaka vs Pele"
        }`;
    }

    restartButton.addEventListener("click", startGame);

    document
        .getElementById("muteButton")
        .addEventListener("click", function () {
            bgMusic.muted = !bgMusic.muted;
            this.textContent = bgMusic.muted ? "Unmute" : "Mute";
        });

    startGame();
});
