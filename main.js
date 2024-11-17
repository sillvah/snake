const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 100;
const BOX_SIZE = 32;
const SNAKE_COLOR = "#00e575";
const BACKGROUND_COLOR = "#2b2d2d";
const FOOD_COLOR = "#f4b400";

let score = 0;
const snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
const velocity = { dx: 0, dy: 0 };
const food = { x: 32, y: 32 };

document.addEventListener("keydown", processInput);
const gameLoop = setInterval(() => {
  update();
  render();
}, MS_PER_FRAME);

function processInput(event) {
  switch (event.key) {
    case "ArrowLeft":
      velocity.dx = -BOX_SIZE;
      velocity.dy = 0;
      break;
    case "ArrowUp":
      velocity.dx = 0;
      velocity.dy = -BOX_SIZE;
      break;
    case "ArrowRight":
      velocity.dx = BOX_SIZE;
      velocity.dy = 0;
      break;
    case "ArrowDown":
      velocity.dx = 0;
      velocity.dy = BOX_SIZE;
      break;
  }
}

function update() {
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
