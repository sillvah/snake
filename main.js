const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const MS_PER_FRAME = 16;

document.addEventListener("keydown", processInput);
const gameLoop = setInterval(() => {
  update();
  render();
}, MS_PER_FRAME);

function processInput(event) {}

function update() {}

function render() {}
