Array.prototype.enqueue = Array.prototype.unshift;
Array.prototype.dequeue = Array.prototype.pop;

const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 100;
const BOX_SIZE = 27;
const FOOD_PX = BOX_SIZE / 3;
const FOOD_POINTS = 7;
const SNAKE_COLOR = "#251913";
const FOOD_COLOR = "#24190f";
const BACKGROUND_COLOR = "#8b966c";
const foodEatenSound = new Audio("assets/audio/food.mp3");
const collisionSound = new Audio("assets/audio/collision.mp3");

let gameLoop = 0;
let score = 0, highScore = 0;
let food = {};
let directions = [];
let velocity = { dx: BOX_SIZE, dy: 0 };
let snake = makeSnake();

render();

const arrowToDirectionMap = {
  ArrowLeft: { dx: -BOX_SIZE, dy: 0 },
  ArrowUp: { dx: 0, dy: -BOX_SIZE },
  ArrowRight: { dx: BOX_SIZE, dy: 0 },
  ArrowDown: { dx: 0, dy: BOX_SIZE },
};

const keyPressed = {};
document.addEventListener("keydown", processInput);
document.addEventListener("keyup", ({ key }) => keyPressed[key] = false);

function processInput(event) {
  const { key } = event;
  const nextDirection = arrowToDirectionMap[key];
  if (!keyPressed[key] && nextDirection) {
    keyPressed[key] = true;
    directions.enqueue(nextDirection);
  }

  if (key === "Enter" && gameLoop === 0) {
    score = 0;
    document.getElementById("score").innerText = "0000";
    directions = [];
    velocity = { dx: BOX_SIZE, dy: 0 };
    snake = makeSnake();
    food = makeFood();
    gameLoop = setInterval(() => {
      update();
      render();
    }, MS_PER_FRAME);
  }
}

function update() {
  if (directions.length > 0) {
    const nextDirection = directions.dequeue();
    if (nextDirection.dx < 0 && velocity.dx <= 0) {
      velocity = nextDirection;
    } else if (nextDirection.dx > 0 && velocity.dx >= 0) {
      velocity = nextDirection;
    } else if (nextDirection.dy < 0 && velocity.dy <= 0) {
      velocity = nextDirection;
    } else if (nextDirection.dy > 0 && velocity.dy >= 0) {
      velocity = nextDirection;
    }
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
    foodEatenSound.play();
    food = makeFood();

    score += FOOD_POINTS;
    document.getElementById("score").innerText = String(score).padStart(4, "0");
    if (score > highScore) {
      highScore = score;
      const newHighScore = String(highScore).padStart(4, "0");
      document.getElementById("high-score").innerText = newHighScore;
    }
  } else {
    snake.pop();
  }

  const snakeBody = snake.slice(1);
  if (snakeBody.some(({ x, y }) => snake[0].x === x && snake[0].y === y)) {
    collisionSound.play();
    clearInterval(gameLoop);
    gameLoop = 0;
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

/**
 * Creates a snake at the default position on the canvas.
 */
function makeSnake() {
  return [
    { x: canvas.width / 2 - 1 * BOX_SIZE, y: canvas.height / 2 },
    { x: canvas.width / 2 - 2 * BOX_SIZE, y: canvas.height / 2 },
    { x: canvas.width / 2 - 3 * BOX_SIZE, y: canvas.height / 2 },
  ];
}

/**
 * Creates a new food object at a random position within the canvas.
 */
function makeFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / BOX_SIZE)) * BOX_SIZE,
    y: Math.floor(Math.random() * (canvas.height / BOX_SIZE)) * BOX_SIZE,
  };
}
