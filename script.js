const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

const brickRowCount = Math.floor(Math.random() * 6) + 3;
const brickHeight = 60;
const bricks = [];
const platformWidth = 120;
const platformHeight = 20;
const ball = {
  x: canvas.width / 2,
  y: canvas.height - platformHeight - 15,
  radius: 15,
  color: 'blue',
  delta: 5
};
let ballRandom = Math.trunc(Math.random() * 2) - 1;
let platformX = (canvas.width - platformWidth) / 2;
let isPressed = false

const randomWidths = [];
for (let j = 0; j < brickRowCount; j++) {
  const random = Math.floor(Math.random() * 6) + 3;
  randomWidths.push(random);
}

let brickY = 0;
for (let i = 0; i < brickRowCount; i++) {
  const random = randomWidths[i];
  const brickWidth = canvas.width / random;
  let brickX = 0;
  for (let j = 0; j < random; j++) {
    bricks.push({
      x: brickX,
      y: brickY,
      width: brickWidth,
      height: brickHeight,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    });
    brickX += brickWidth;
  }
  brickY += brickHeight;
}


function drawBricks() {
  for (let i = 0; i < bricks.length; i++) {
    ctx.fillStyle = bricks[i].color;
    ctx.fillRect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);
  }
}

function drawPlatform() {
  ctx.fillStyle = "red";
  ctx.fillRect(platformX, canvas.height - platformHeight, platformWidth, platformHeight);
}


function drawBall() {
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall()
  drawPlatform()
}
function jumpBall() {
  if (!ballRandom) (ballRandom = Math.round(Math.random() * 2) - 1)
  ctx.beginPath();
  ball.y -= ball.delta
  ball.x += ballRandom * 5
  ctx.stroke()
}


function checkCollision() {
  for (let i = 0; i < bricks.length; i++) {
    const b = bricks[i];
    if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + b.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + b.height) {
      ball.delta = -ball.delta
      bricks.splice(i, 1);
      break;
    }
    if (ball.x + ball.radius > canvas.width - ball.delta || ball.x - ball.radius < ball.delta) {
      ballRandom *= -1;
    }
  }

}

document.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'ArrowRight' || e.key === 'd') {
    platformX !== 400 && (platformX += 20)
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    platformX !== 0 && (platformX -= 20)
  }
  if (e.key === ' ') {
    isPressed = true
  }
})

function loop() {
  requestAnimationFrame(loop)
  draw()
  if (isPressed === true) {
    jumpBall()
  }
  checkCollision()
}

loop();