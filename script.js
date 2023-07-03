const canvas = document.querySelector('.container__canvas');
const ctx = canvas.getContext('2d');

const brickRowCount = Math.floor(Math.random() * 6) + 3;
const brickHeight = 50;
const bricks = [];
const platformWidth = 150;
const platformHeight = 20;
const platformY = 15;
const ballRadius = 15;
const ball = {
  x: canvas.width / 2,
  y: canvas.height - platformHeight - platformY - ballRadius,
  radius: ballRadius,
  color: 'green',
  delta: 5,
};
const life = document.querySelector('.life');
const win = document.querySelector('.win');
const tryAgain = document.querySelector('.game-over');
const randomWidths = [];
let ballRandom = Math.trunc(Math.random() * 2) - 1;
let platformX = (canvas.width - platformWidth) / 2;
let isPressed = false;
let a = 3;
let platformBend = 0;
let ballBend = 0;

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
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
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
  ctx.fillStyle = 'white';
  roundRect(
    platformX,
    canvas.height - platformHeight - platformY,
    platformWidth,
    platformHeight,
    10
  );
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  if (a === 2) {

    ball.color = 'yellow';
  }
  if (a === 1) {
    ball.color = 'red';
  }
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPlatform();
  ctx.font = '24px Arial'
  ctx.fillStyle = 'white'
  if(a===3){
    ctx.fillText('🤍 🤍 🤍', 10, 776 ) 
  }
  if(a===2){
    ctx.fillText('🤍 🤍', 10, 776)
  }
  if(a===1){
    ctx.fillText('🤍', 10, 776)
  }
  
}
function jumpBall() {
  if (ballRandom === 0) ballRandom = Math.round(Math.random() * 2) - 1;

  if (ball.y + ball.radius >= canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.delta = -ball.delta;
    const bendInterval = setInterval(() => {
      platformBend -= 5;
      ballBend -= 0.1;
 
      platformX += platformBend;
      ball.x += ballBend;
 
      if (platformBend <= -15) {
        clearInterval(bendInterval);
        platformX = (canvas.width - platformWidth) / 2; 
        ball.x = canvas.width / 2; 
        ball.y = canvas.height - platformHeight - platformY - ballRadius;
        isPressed = false;
      }
    }, 10);
  }

  ctx.beginPath();
  ball.y -= ball.delta;
  ball.x += ballRandom * 5;
  ctx.stroke();
  ctx.closePath()
}
function checkCollision() {
  for (let i = 0; i < bricks.length; i++) {
    const b = bricks[i];
    if (
      ball.x + ball.radius >= b.x &&
      ball.x - ball.radius <= b.x + b.width &&
      ball.y + ball.radius >= b.y &&
      ball.y - ball.radius <= b.y + b.height
    ) {
      bricks.splice(i, 1);

      let closestX = Math.max(b.x, Math.min(ball.x, b.x + b.width));
      let closestY = Math.max(b.y, Math.min(ball.y, b.y + b.height));

      let distanceX = ball.x - closestX;
      let distanceY = ball.y - closestY;
      let distanceSquared =
        (distanceX / ball.radius) * (distanceX / ball.radius) +
        (distanceY / ball.radius) * (distanceY / ball.radius);

      if (distanceSquared <= ball.radius * ball.radius) {
        let angle = Math.atan2(distanceY, distanceX);
        let collisionAngle = Math.abs(angle);

        if (
          collisionAngle > Math.PI / 4 &&
          collisionAngle < (3 * Math.PI) / 4
        ) {
          ball.delta *= -1;
        } else {
          ballRandom *= -1;
        }
      }

      break;
    }
  }
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ballRandom *= -1;
  }

  if (
    ball.y + ball.radius >= canvas.height - platformHeight - platformY &&
    ball.y + ball.radius <= canvas.height - platformY &&
    ball.x >= platformX &&
    ball.x <= platformX + platformWidth
  ) {
    ball.delta = -ball.delta;
    ball.y = canvas.height - platformHeight - platformY - ball.radius;
  }

  if (ball.y - ball.radius <= 0) {
    ball.delta = -ball.delta;
    ball.y = ball.radius;
  }
}
document.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'ArrowRight' || e.key === 'd') {
    platformX <= canvas.width - platformWidth  && (platformX += 20);
    !isPressed &&
      ball.x <= canvas.width  - (platformWidth / 2) &&
      (ball.x += 20);
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    platformX > 0 && (platformX -= 20);
    !isPressed && ball.x >= platformWidth / 2 && (ball.x -= 20) ;
  }
  if (e.key === ' ') {
    isPressed = true;
  }
});

function reload() {
  location.reload()
}

function loop() {
  if (ball.y + ball.radius >= canvas.height) {
    if (a === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '70px Arial'
      ctx.fillStyle = 'white'
      ctx.fillText('lav ches xaxum axper jan', 250, 410)
      canvas.addEventListener('click', () => {
        location.reload()
      })
      return;
    } else {
      a--; 
    }

  }  
  draw();
  if (bricks.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '70px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Verjapes haxtecirs', 300, 410)
    return;
  }
  if (isPressed === true) {
    jumpBall();
  }

  checkCollision();
  requestAnimationFrame(loop);
}

loop();
