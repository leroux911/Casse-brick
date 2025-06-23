const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;
const ballRadius = 8;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// Touches clavier
document.addEventListener("keydown", e => {
  if(e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", e => {
  if(e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// Briques
const brickRowCount = 4;
const brickColumnCount = 10;
const brickWidth = 44;
const brickHeight = 15;
const brickPadding = 4;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;

let bricks = [];
for(let r = 0; r < brickRowCount; r++) {
  bricks[r] = [];
  for(let c = 0; c < brickColumnCount; c++) {
    bricks[r][c] = { x: 0, y: 0, visible: true };
  }
}

function drawBricks() {
  for(let r = 0; r < brickRowCount; r++) {
    for(let c = 0; c < brickColumnCount; c++) {
      let b = bricks[r][c];
      if(b.visible) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        b.x = brickX;
        b.y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ffcc00";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for(let r = 0; r < brickRowCount; r++) {
    for(let c = 0; c < brickColumnCount; c++) {
      let b = bricks[r][c];
      if(b.visible) {
        if(ballX > b.x && ballX < b.x + brickWidth &&
           ballY > b.y && ballY < b.y + brickHeight) {
          ballDY = -ballDY;
          b.visible = false;
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if(ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) ballDX = -ballDX;
  if(ballY + ballDY < ballRadius) ballDY = -ballDY;
  else if(ballY + ballDY > canvas.height - ballRadius) {
    if(ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      document.location.reload(); // game over
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  if(leftPressed && paddleX > 0) paddleX -= 7;

  ballX += ballDX;
  ballY += ballDY;

  requestAnimationFrame(draw);
}

draw();