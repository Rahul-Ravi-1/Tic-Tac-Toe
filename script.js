const readline = require("node:readline");

function Player(name, marker) {
  return { name, marker };
}

function GameBoard() {
  const board = [];

  function initialize() {
    for (let row = 0; row < 3; row += 1) {
      board[row] = [];
      for (let col = 0; col < 3; col += 1) {
        board[row][col] = "";
      }
    }
  }

  function getBoard() {
    return board;
  }

  function placeMark(row, col, marker) {
    if (row < 0 || row > 2 || col < 0 || col > 2) return false;
    if (board[row][col] !== "") return false;
    board[row][col] = marker;
    return true;
  }

  function reset() {
    initialize();
  }

  initialize();
  return { getBoard, placeMark, reset };
}

const GameController = (() => {
  const gameboard = GameBoard();
  const players = [Player("Player 1", "X"), Player("Player 2", "O")];
  let currentPlayerIndex = 0;

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function switchTurn() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function printBoard() {
    const board = gameboard.getBoard();
    for (let row = 0; row < 3; row += 1) {
      const displayRow = board[row].map((cell) => (cell === "" ? " " : cell));
      console.log(` ${displayRow[0]} | ${displayRow[1]} | ${displayRow[2]} `);
      if (row < 2) console.log("---+---+---");
    }
  }

  function checkWinner(marker) {
    const b = gameboard.getBoard();
    const winLines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    return winLines.some((line) =>
      line.every(([row, col]) => b[row][col] === marker),
    );
  }

  function isDraw() {
    const b = gameboard.getBoard();
    return b.every((row) => row.every((cell) => cell !== ""));
  }

  function resetGame() {
    gameboard.reset();
    currentPlayerIndex = 0;
  }

  return {
    gameboard,
    getCurrentPlayer,
    switchTurn,
    printBoard,
    checkWinner,
    isDraw,
    resetGame,
  };
})();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function parseMove(input) {
  const trimmed = input.trim().toLowerCase();

  // Small feature: allow quitting from the move prompt.
  if (trimmed === "q" || trimmed === "quit") {
    return { quit: true };
  }

  const [rowText, colText] = input.trim().split(/\s+/);
  const row = Number(rowText) - 1;
  const col = Number(colText) - 1;

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return null;
  }

  return { row, col };
}

async function playRound() {
  while (true) {
    console.clear();
    console.log("Tic-Tac-Toe");
    console.log("Enter moves as: row col (values 1-3), or 'q' to quit\n");
    GameController.printBoard();
    console.log("");

    const currentPlayer = GameController.getCurrentPlayer();
    const input = await ask(`${currentPlayer.name} (${currentPlayer.marker}) move: `);
    const move = parseMove(input);

    if (move && move.quit) {
      console.log("\nGame exited by player.");
      return "quit";
    }

    if (!move) {
      console.log("\nInvalid format. Use: row col (example: 2 3)");
      await ask("Press Enter to continue...");
      continue;
    }

    const wasPlaced = GameController.gameboard.placeMark(
      move.row,
      move.col,
      currentPlayer.marker,
    );

    if (!wasPlaced) {
      console.log("\nInvalid move. Cell is taken or out of range.");
      await ask("Press Enter to continue...");
      continue;
    }

    if (GameController.checkWinner(currentPlayer.marker)) {
      console.clear();
      GameController.printBoard();
      console.log(`\n${currentPlayer.name} wins!`);
      return;
    }

    if (GameController.isDraw()) {
      console.clear();
      GameController.printBoard();
      console.log("\nIt's a draw!");
      return;
    }

    GameController.switchTurn();
  }
}

async function startGame() {
  while (true) {
    GameController.resetGame();
    const result = await playRound();
    if (result === "quit") {
      break;
    }
    const again = (await ask("\nPlay again? (y/n): ")).trim().toLowerCase();
    if (again !== "y") {
      break;
    }
  }

  rl.close();
}

startGame();