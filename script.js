const backgroundMusic = new Audio("music.mp3");
const turnSound = new Audio("ting.mp3");
const gameOverSound = new Audio("gameover.mp3");

backgroundMusic.volume = 0.3; // Background music volume set to 30%
turnSound.volume = 0.5;      // Turn sound volume set to 50%
gameOverSound.volume = 0.7;  // Game over sound volume set to 70%

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

const infoDisplay = document.querySelector(".info");
const resetButton = document.getElementById("reset");
const gameCells = document.querySelectorAll(".box");
const winningImage = document.querySelector(".image-display img");

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const initializeGame = () => {
  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch(e => {}); // Autoplay might be blocked by browsers, but no error message will show
  backgroundMusic.loop = true;

  infoDisplay.innerText = `Turn for ${currentPlayer}`;
  winningImage.style.width = "0px";
  winningImage.style.opacity = "0";

  gameCells.forEach((cell) => {
    const boxText = cell.querySelector(".boxtext");
    boxText.innerText = "";
    boxText.classList.remove("X", "O");
    cell.classList.remove("clicked", "win-highlight");
  });

  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
};

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
  boardState[clickedCellIndex] = currentPlayer;
  const boxText = clickedCell.querySelector(".boxtext");
  boxText.innerText = currentPlayer;
  boxText.classList.add(currentPlayer);

  clickedCell.classList.add("clicked");
  turnSound.currentTime = 0;
  turnSound.play();

  setTimeout(() => {
    clickedCell.classList.remove("clicked");
  }, 400);
};

const checkGameResult = () => {
  let roundWon = false;
  let winningCombination = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    const a = boardState[winCondition[0]];
    const b = boardState[winCondition[1]];
    const c = boardState[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningCombination = winCondition;
      break;
    }
  }

  if (roundWon) {
    infoDisplay.innerText = `${currentPlayer} Won! 🎉`;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    winningImage.style.width = "200px";
    winningImage.style.opacity = "1";
    gameActive = false;

    winningCombination.forEach(index => {
      gameCells[index].classList.add('win-highlight');
    });
    return;
  }

  const isDraw = !boardState.includes("");
  if (isDraw) {
    infoDisplay.innerText = "It's a Draw! 🤝";
    gameActive = false;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    return;
  }

  changePlayerTurn();
};

const changePlayerTurn = () => {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  infoDisplay.innerText = `Turn for ${currentPlayer}`;

  if (currentPlayer === "O" && gameActive) {
    infoDisplay.innerText = "AI Thinking... 🤔";
    setTimeout(aiMove, 1000);
  }
};

const aiMove = () => {
  if (!gameActive) return;

  const emptyCellsIndices = [];
  boardState.forEach((cellValue, index) => {
    if (cellValue === "") {
      emptyCellsIndices.push(index);
    }
  });

  if (emptyCellsIndices.length === 0) {
    checkGameResult();
    return;
  }

  let bestMove = -1;

  for (let i = 0; i < emptyCellsIndices.length; i++) {
    const tempBoard = [...boardState];
    const move = emptyCellsIndices[i];
    tempBoard[move] = "O";

    if (checkWinningMove(tempBoard, "O")) {
      bestMove = move;
      break;
    }
  }

  if (bestMove === -1) {
    for (let i = 0; i < emptyCellsIndices.length; i++) {
      const tempBoard = [...boardState];
      const move = emptyCellsIndices[i];
      tempBoard[move] = "X";

      if (checkWinningMove(tempBoard, "X")) {
        bestMove = move;
        break;
      }
    }
  }

  if (bestMove === -1 && emptyCellsIndices.includes(4)) {
    bestMove = 4;
  }

  const corners = [0, 2, 6, 8];
  if (bestMove === -1) {
    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i];
      if (emptyCellsIndices.includes(corner)) {
        bestMove = corner;
        break;
      }
    }
  }

  if (bestMove === -1 && emptyCellsIndices.length > 0) {
    const sides = [1, 3, 5, 7].filter(s => emptyCellsIndices.includes(s));
    if (sides.length > 0) {
        bestMove = sides[Math.floor(Math.random() * sides.length)];
    } else {
        bestMove = emptyCellsIndices[0];
    }
  }

  const selectedCell = gameCells[bestMove];
  handleCellPlayed(selectedCell, bestMove);
  checkGameResult();
};

const checkWinningMove = (board, player) => {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
};

gameCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    const boxText = cell.querySelector(".boxtext");
    if (boxText.innerText === "" && gameActive && currentPlayer === "X") {
      handleCellPlayed(cell, index);
      checkGameResult();
    } else if (!gameActive) {
        infoDisplay.innerText = "Game Over! Press Reset.";
    }
  });
});

resetButton.addEventListener("click", initializeGame);

// Initial game setup
initializeGame();

// Autoplay music on first user interaction (for browser policies)
let userInteracted = false;
document.addEventListener('click', () => {
    if (!userInteracted) {
        backgroundMusic.play().catch(e => {});
        userInteracted = true;
    }
}, { once: true });
