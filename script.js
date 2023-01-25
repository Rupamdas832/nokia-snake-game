const gameContainer = document.querySelector(".game-container");
const board = document.querySelector(".board");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");
const gameOverDisplay = document.querySelector(".game-over");
const gameOverContainer = document.querySelector(".game-over-container");
const gameStartContainer = document.querySelector(".game-start-screen");

const blockSize = 15;
const col = 30;
const row = 20;
let context;
let foodX;
let foodY;
let snakeX = blockSize * 4;
let snakeY = 10;
let snakeSpeedX = 0;
let snakeSpeedY = 0;
let speed = 10;
let score = 0;
let isGameOver = false;
let isGameStart = false;
let clearUpdate;
let timer;
let timerValue = 50;
let snakeBody = [
  [blockSize * 4, 10],
  [blockSize * 3, 10],
  [blockSize * 2, 10],
  [blockSize, 10],
];
const boardColor = "rgb(186, 199, 0)";
const foodColor = "green";
const snakeColor = "rgb(84, 88, 27)";

function startGame() {
  gameStartContainer.style.display = "none";
  gameContainer.style.display = "flex";
  board.width = blockSize * col;
  board.height = blockSize * row;
  context = board.getContext("2d");
  window.addEventListener("keyup", changeSnakeDirection);
  clearUpdate = setInterval(() => {
    if (isGameOver) {
      clearInterval(clearUpdate);
    } else {
      update();
    }
  }, 100);

  timer = setInterval(() => {
    timerDisplay.innerText = timerValue;
    timerValue--;
  }, 1000);

  placeFood();
}

function update() {
  context.fillStyle = boardColor;
  context.fillRect(0, 0, board.width, board.height);

  //food color & size
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, blockSize, blockSize);

  snakeX = snakeX + snakeSpeedX * speed;
  snakeY = snakeY + snakeSpeedY * speed;

  context.fillStyle = snakeColor;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  //Ate food
  if (
    Math.abs(snakeX - foodX) < blockSize &&
    Math.abs(snakeY - foodY) < blockSize
  ) {
    placeFood();
    score = score + timerValue * 2;
    timerValue = 50;
    scoreDisplay.innerText = score;
    snakeBody.push([snakeX, snakeY]);
  }

  //Change food location if timer ends
  if (timerValue < 0) {
    timerValue = 50;
    placeFood();
  }

  //Boundry protection
  boundryCollide();

  //Increase body
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillStyle = snakeColor;
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  //snake body follow the head
  if (isGameStart) {
    followHead();
  }
}

function placeFood() {
  foodX = Math.floor(Math.random() * col) * blockSize;
  foodY = Math.floor(Math.random() * row) * blockSize;
}

function changeSnakeDirection(e) {
  if (!isGameStart) {
    isGameStart = true;
  }
  if (e.code === "ArrowUp" && snakeSpeedY !== 1) {
    snakeSpeedX = 0;
    snakeSpeedY = -1;
  } else if (e.code === "ArrowDown" && snakeSpeedY !== -1) {
    snakeSpeedX = 0;
    snakeSpeedY = 1;
  } else if (e.code === "ArrowLeft" && snakeSpeedX !== 1) {
    snakeSpeedX = -1;
    snakeSpeedY = 0;
  } else if (e.code === "ArrowRight" && snakeSpeedX !== -1) {
    snakeSpeedX = 1;
    snakeSpeedY = 0;
  }
}

function followHead() {
  for (let j = snakeBody.length - 1; j > 0; j--) {
    snakeBody[j] = snakeBody[j - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }
}

function boundryCollide() {
  if (
    snakeX < -5 ||
    snakeX > blockSize * col - 20 ||
    snakeY < -5 ||
    snakeY > blockSize * row - 20
  ) {
    isGameOver = true;
    gameOverContainer.style.opacity = 1;
    gameOverDisplay.innerText = "Game Over";
    clearInterval(timer);
  }
}

function restartGame() {
  window.location.reload();
}
