const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 100;
const BOX_SIZE = 32;
const SNAKE_COLOR = "#00e575";
const BACKGROUND_COLOR = "#2b2d2d";

const snake = [{ x: (canvas.width - 32) / 2, y: (canvas.height - 32) / 2 }];
const velocity = { dx: 0, dy: 0 };

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
  snake.pop();
}

function render() {
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = SNAKE_COLOR;
  snake.forEach((segment) => {
    context.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
  });
}
