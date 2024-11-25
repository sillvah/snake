Array.prototype.enqueue = Array.prototype.unshift;
Array.prototype.dequeue = Array.prototype.pop;

const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 100;
const BOX_SIZE = 27;
const FOOD_PX = BOX_SIZE / 3;
const SNAKE_COLOR = "#251913";
const FOOD_COLOR = "#24190f";
const BACKGROUND_COLOR = "#8b966c";

let gameLoop = 0;
let score = 0, highScore = 0;
let food = {};
let directions = [];
let velocity = { dx: BOX_SIZE, dy: 0 };
let snake = [
  { x: BOX_SIZE, y: 0 },
  { x: 0, y: 0 },
];

render();
document.addEventListener("keydown", processInput);

function processInput(event) {
  const { key } = event;

  if (key === "Enter" && gameLoop === 0) {
    document.getElementById("score").innerText = score = 0;
    directions = [];
    velocity = { dx: BOX_SIZE, dy: 0 };
    snake = [
      { x: BOX_SIZE, y: 0 },
      { x: 0, y: 0 },
    ];
    food = {
      x: Math.floor(Math.random() * (canvas.width / BOX_SIZE)) * BOX_SIZE,
      y: Math.floor(Math.random() * (canvas.height / BOX_SIZE)) * BOX_SIZE,
    };
    gameLoop = setInterval(() => {
      update();
      render();
    }, MS_PER_FRAME);
  }

  if (key === "ArrowLeft" && velocity.dx <= 0) {
    directions.enqueue({ dx: -BOX_SIZE, dy: 0 });
  } else if (key === "ArrowUp" && velocity.dy <= 0) {
    directions.enqueue({ dx: 0, dy: -BOX_SIZE });
  } else if (key === "ArrowRight" && velocity.dx >= 0) {
    directions.enqueue({ dx: BOX_SIZE, dy: 0 });
  } else if (key === "ArrowDown" && velocity.dy >= 0) {
    directions.enqueue({ dx: 0, dy: BOX_SIZE });
  }
}

function update() {
  if (directions.length > 0) {
    velocity = directions.dequeue();
  }

  const snakeHead = snake[0];
  const nextHeadPosition = {
    x: snakeHead.x + velocity.dx,
    y: snakeHead.y + velocity.dy,
  };
  snake.unshift(nextHeadPosition);

  if (nextHeadPosition.x > canvas.width - BOX_SIZE) {
    nextHeadPosition.x = 0;
  } else if (nextHeadPosition.x < 0) {
    nextHeadPosition.x = canvas.width - BOX_SIZE;
  } else if (nextHeadPosition.y > canvas.height - BOX_SIZE) {
    nextHeadPosition.y = 0;
  } else if (nextHeadPosition.y < 0) {
    nextHeadPosition.y = canvas.height - BOX_SIZE;
  }

  if (snake[0].x === food.x && snake[0].y === food.y) {
    document.getElementById("score").innerText = ++score;
    food.x = Math.floor(Math.random() * (canvas.width / BOX_SIZE)) * BOX_SIZE;
    food.y = Math.floor(Math.random() * (canvas.height / BOX_SIZE)) * BOX_SIZE;
  } else {
    snake.pop();
  }

  const snakeBody = snake.slice(1);
  if (snakeBody.some(({ x, y }) => snake[0].x === x && snake[0].y === y)) {
    clearInterval(gameLoop);
    gameLoop = 0;

    if (score > highScore) {
      document.getElementById("high-score").innerText = highScore = score;
    }
  }
}

function render() {
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = FOOD_COLOR;
  context.fillRect(food.x + FOOD_PX, food.y, FOOD_PX, FOOD_PX);
  context.fillRect(food.x, food.y + FOOD_PX, FOOD_PX, FOOD_PX);
  context.fillRect(food.x + FOOD_PX * 2, food.y + FOOD_PX, FOOD_PX, FOOD_PX);
  context.fillRect(food.x + FOOD_PX, food.y + FOOD_PX * 2, FOOD_PX, FOOD_PX);

  context.fillStyle = SNAKE_COLOR;
  context.strokeStyle = BACKGROUND_COLOR;
  snake.forEach((segment) => {
    context.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
    context.strokeRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
  });
}
