let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp"; 
let playerChoice = "X"; 

const boardElement = document.getElementById("board");
const winnerDisplay = document.getElementById("winnerDisplay");
const restartBtn = document.getElementById("restartBtn");
const pvpBtn = document.getElementById("pvp-btn");
const aiBtn = document.getElementById("ai-btn");

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function setMode(selectedMode) {
    mode = selectedMode;
    pvpBtn.classList.remove("active");
    aiBtn.classList.remove("active");
    document.getElementById(`${selectedMode}-btn`).classList.add("active");
    restartGame();
}

function choosePlayer(choice) {
    playerChoice = choice;
    document.querySelectorAll(".player-btn").forEach(btn => btn.classList.remove("selected"));
    document.querySelector(`.player-btn:nth-child(${choice === "X" ? 2 : 3})`).classList.add("selected");
    restartGame();
}

function createBoard() {
    boardElement.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    winnerDisplay.textContent = "";

    board.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", index);
        cell.addEventListener("click", handleCellClick);
        boardElement.appendChild(cell);
    });

    if (mode === "ai" && playerChoice === "O") {
        setTimeout(aiMove, 500);
    }
}

function handleCellClick(event) {
    if (!gameActive) return;
    const index = event.target.getAttribute("data-index");
    if (board[index] !== "") return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    
    if (checkWinner()) return;
    
    if (!board.includes("")) {
        winnerDisplay.textContent = "Game Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (mode === "ai" && currentPlayer !== playerChoice) {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let emptyCells = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (emptyCells.length === 0) return;

    let aiChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[aiChoice] = currentPlayer;
    document.querySelector(`[data-index='${aiChoice}']`).textContent = currentPlayer;

    if (checkWinner()) return;

    if (!board.includes("")) {
        winnerDisplay.textContent = "Game Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = playerChoice;
}

function checkWinner() {
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.querySelector(`[data-index='${a}']`).classList.add("winning-cell");
            document.querySelector(`[data-index='${b}']`).classList.add("winning-cell");
            document.querySelector(`[data-index='${c}']`).classList.add("winning-cell");
            winnerDisplay.textContent = `${board[a]} Wins!`;
            gameActive = false;
            return true;
        }
    }
    return false;
}

function restartGame() {
    board.fill("");
    gameActive = true;
    currentPlayer = "X";
    createBoard();
}

restartBtn.addEventListener("click", restartGame);
document.getElementById("pvp-btn").addEventListener("click", () => setMode("pvp"));
document.getElementById("ai-btn").addEventListener("click", () => setMode("ai"));
createBoard();
