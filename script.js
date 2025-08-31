// script.js
const boardElement = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const messageElement = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const pvpBtn = document.getElementById('pvpMode');
const pvcBtn = document.getElementById('pvcMode');

// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'x';
let gameActive = true;
let mode = 'pvp'; // default mode: player vs player

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

// Initialize or reset game state
function initializeGame() {
  board.fill('');
  currentPlayer = 'x';
  gameActive = true;
  messageElement.textContent = `Current Turn: ${currentPlayer.toUpperCase()}`;
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.style.pointerEvents = 'auto';
  });
  if(mode === 'pvc' && currentPlayer === 'o') {
    computerMove();
  }
}

// Check winning condition
function checkWin(player) {
  return winningCombinations.some(combination => 
    combination.every(index => board[index] === player)
  );
}

// Check draw condition
function checkDraw() {
  return board.every(cell => cell !== '');
}

// Handle cell click
function handleCellClick(e) {
  const index = parseInt(e.target.getAttribute('data-cell-index'));
  if (!gameActive || board[index] !== '') return;

  makeMove(index, currentPlayer);
  if (checkWin(currentPlayer)) {
    gameActive = false;
    messageElement.textContent = `${currentPlayer.toUpperCase()} Wins!`;
    cells.forEach(cell => cell.style.pointerEvents = 'none');
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    messageElement.textContent = "It's a Draw!";
    return;
  }

  // Switch Player
  currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
  messageElement.textContent = `Current Turn: ${currentPlayer.toUpperCase()}`;

  if (mode === 'pvc' && currentPlayer === 'o' && gameActive) {
    // Computer's turn
    computerMove();
  }
}

// Make a move on the board and UI
function makeMove(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.classList.add(player);
  cell.style.pointerEvents = 'none';
}

// Simple AI logic for computer move: random empty cell
function computerMove() {
  let availableIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  if(availableIndices.length === 0) return;

  // AI picks random available position
  const aiIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

  // Perform AI move with a small delay to simulate thinking
  setTimeout(() => {
    makeMove(aiIndex, 'o');

    if (checkWin('o')) {
      gameActive = false;
      messageElement.textContent = "O Wins!";
      cells.forEach(cell => cell.style.pointerEvents = 'none');
      return;
    }

    if (checkDraw()) {
      gameActive = false;
      messageElement.textContent = "It's a Draw!";
      return;
    }

    currentPlayer = 'x'; // Back to human player
    messageElement.textContent = `Current Turn: X`;
  }, 500);
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', initializeGame);
pvpBtn.addEventListener('click', () => {
  mode = 'pvp';
  initializeGame();
});
pvcBtn.addEventListener('click', () => {
  mode = 'pvc';
  initializeGame();
});

// Start game on load
initializeGame();