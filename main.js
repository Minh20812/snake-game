const canvas = document.getElementById("gameCanvas");
const scoreDisplay = document.getElementById("scoreDisplay");
const toggleGrid = document.getElementById("toggleGrid");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const cols = Math.floor(canvas.width / gridSize);
const rows = Math.floor(canvas.height / gridSize);

let snake, food, direction, gameOver, score, lastKey, speed;

function initializeGame() {
  snake = [{ x: 9, y: 9 }];
  food = { x: 10, y: 10 };
  direction = { x: 0, y: 0 };
  gameOver = false;
  score = 0;
  speed = 200;
  lastKey = null;
  scoreDisplay.innerText = score;
  placeFood();
  gameLoop();
}

function drawGrid() {
  if (!toggleGrid.checked) return;
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.innerText = score;
    placeFood();
    if (score > 5 && score <= 15) {
      speed = 150;
    } else if (score > 15 && score <= 25) {
      speed = 100;
    } else if (score > 25) {
      speed = 50;
    }
  } else {
    snake.pop();
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };

  if (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

function checkCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].y < 0 ||
    snake[0].x >= cols ||
    snake[0].y >= rows ||
    snake
      .slice(1)
      .some((segment) => segment.x === snake[0].x && segment.y === snake[0].y)
  ) {
    gameOver = true;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === lastKey) return;

  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
    default:
      return;
  }

  lastKey = e.key;
});

function gameLoop() {
  if (gameOver) {
    setTimeout(() => {
      if (confirm("Game Over. Restart?")) initializeGame();
    }, 100);
    return;
  }

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkCollision();
    lastKey = null;
    gameLoop();
  }, speed);
}

initializeGame();
