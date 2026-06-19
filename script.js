const gridElement = document.getElementById("grid");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");

const size = 4;
let grid = [];
let score = 0;
let canMove = false;

function createGrid() {
  grid = Array.from({ length: size }, () => Array(size).fill(0));
}

function drawGrid() {
  gridElement.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.value = grid[r][c] || "";
      cell.textContent = grid[r][c] || "";
      gridElement.appendChild(cell);
    }
  }
  scoreElement.textContent = score;
}

function slide(row) {
  const filtered = row.filter((value) => value !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered.splice(i + 1, 1);
    }
  }
  while (filtered.length < size) filtered.push(0);
  return filtered;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < size; r++) {
    const newRow = slide(grid[r]);
    if (newRow.some((val, i) => val !== grid[r][i])) moved = true;
    grid[r] = newRow;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < size; r++) {
    const reversed = grid[r].slice().reverse();
    const newRow = slide(reversed).reverse();
    if (newRow.some((val, i) => val !== grid[r][i])) moved = true;
    grid[r] = newRow;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < size; c++) {
    const column = grid.map((row) => row[c]);
    const newColumn = slide(column);
    for (let r = 0; r < size; r++) {
      if (grid[r][c] !== newColumn[r]) moved = true;
      grid[r][c] = newColumn[r];
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < size; c++) {
    const column = grid.map((row) => row[c]).reverse();
    const newColumn = slide(column).reverse();
    for (let r = 0; r < size; r++) {
      if (grid[r][c] !== newColumn[r]) moved = true;
      grid[r][c] = newColumn[r];
    }
  }
  return moved;
}

function canMoveAny() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) return true;
      if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function checkGameOver() {
  if (!canMoveAny()) {
    alert("game over! try again and make a bigger cupcake.");
  }
}

function handleMove(direction) {
  let moved = false;
  if (direction === "left") moved = moveLeft();
  if (direction === "right") moved = moveRight();
  if (direction === "up") moved = moveUp();
  if (direction === "down") moved = moveDown();

  if (moved) {
    addRandomCupcake();
    drawGrid();
    checkGameOver();
  }
}

function startGame() {
  createGrid();
  score = 0;
  addRandomCupcake();
  addRandomCupcake();
  drawGrid();
}

restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") handleMove("left");
  if (event.key === "ArrowRight") handleMove("right");
  if (event.key === "ArrowUp") handleMove("up");
  if (event.key === "ArrowDown") handleMove("down");
});

startGame();
