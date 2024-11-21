const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 100;
const BOX_SIZE = 32;
const SNAKE_COLOR = "#00e575";
const BACKGROUND_COLOR = "#2b2d2d";
const FOOD_COLOR = "#f4b400";

let score = 0;
const snake = [
  { x: (canvas.width / 4) - BOX_SIZE, y: canvas.height / 2 },
  { x: (canvas.width / 4) - (BOX_SIZE * 2), y: canvas.height / 2 },
];
const directionsQueue = [];
const velocity = { dx: BOX_SIZE, dy: 0 };
const food = { x: 32, y: 32 };

document.addEventListener("keydown", processInput);
const gameLoop = setInterval(() => {
  update();
  render();
}, MS_PER_FRAME);

function processInput(event) {
  const { key } = event;
  if (key === "ArrowLeft" && velocity.dx <= 0) {
    directionsQueue.push({ dx: -BOX_SIZE, dy: 0 });
  } else if (key === "ArrowUp" && velocity.dy <= 0) {
    directionsQueue.push({ dx: 0, dy: -BOX_SIZE });
  } else if (key === "ArrowRight" && velocity.dx >= 0) {
    directionsQueue.push({ dx: BOX_SIZE, dy: 0 });
  } else if (key === "ArrowDown" && velocity.dy >= 0) {
    directionsQueue.push({ dx: 0, dy: BOX_SIZE });
  }
}

function update() {
  if (directionsQueue.length > 0) {
    const next = directionsQueue.shift();
    velocity.dx = next.dx;
    velocity.dy = next.dy;
  }

  const snakeHead = snake[0];
  const nextHeadPosition = {
    x: snakeHead.x + velocity.dx,
    y: snakeHead.y + velocity.dy,
  };
  snake.unshift(nextHeadPosition);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    food.x = Math.floor(Math.random() * (canvas.width / BOX_SIZE)) * BOX_SIZE;
    food.y = Math.floor(Math.random() * (canvas.height / BOX_SIZE)) * BOX_SIZE;
    document.getElementById("score").innerText = ++score;
  } else {
    snake.pop();
  }

  const snakeBody = snake.slice(1);
  if (snakeBody.some(({ x, y }) => snake[0].x === x && snake[0].y === y)) {
    clearInterval(gameLoop);
  }
}

function render() {
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = SNAKE_COLOR;
  snake.forEach((segment) => {
    context.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
  });

  context.fillStyle = FOOD_COLOR;
  context.fillRect(food.x, food.y, BOX_SIZE, BOX_SIZE);
}
