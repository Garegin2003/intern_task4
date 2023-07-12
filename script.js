const canvas = document.querySelector('.container__canvas');
const ctx = canvas.getContext('2d');
const brickHeight = 50;
const platformWidth = 150;
const platformHeight = 20;
const platformY = 50;
const ballRadius = 20;
const randomWidths = [];

let bricks = [];
let ballRandom = Math.trunc(Math.random());
let platformX = (canvas.width - platformWidth) / 2;
let isPressed = false;
let lives = 3;
let platformBend = 0;
let ballBend = 0;
let isMovingLeft = false;
let isMovingRight = false;
let score = 0;
let points = 0;
let level = 0;
let ballSpeed = 5;
let animationId;
let isTryAgain = true;

const ball = {
  x: canvas.width / 2,
  y: canvas.height - platformHeight - platformY - ballRadius,
  radius: ballRadius,
  color: 'green',
  delta: ballSpeed,
};

function levelOneGeneration() {

  const brickRowCount = Math.floor(Math.random() * 6) + 3;

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
        color: randomColor(),
      });

      brickX += brickWidth;
    }

    brickY += brickHeight;
  }
}

levelOneGeneration();

function levelTwoGeneration() {

  score = 0;
  bricks = [];

  let brickY = 0;

  for (let i = 0; i < 4; i++) {

    let brickX = canvas.width / 4;

    for (let j = 0; j < 4; j++) {

      bricks.push({
        x: brickX,
        y: brickY,
        width: 150,
        height: 100,
        color: i === 3 ? 'grey' : randomColor(),
        type: i === 3 ? 'unbreakable' : '',

      });
      brickX += 150;

    }
    brickY += 100;

  }

  platformX = (canvas.width - platformWidth) / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - platformHeight - platformY - ballRadius;
  isPressed = false;
  draw();
  level = 2;
  currentScore = bricks.filter((e) => e.type !== 'unbreakable').length;
}

function drawBricks() {

  for (let i = 0; i < bricks.length; i++) {

    ctx.fillStyle = bricks[i].color;
    ctx.fillRect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);

  }
}

function randomColor() {

  return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;

}

function drawPlatform() {

  ctx.fillStyle = 'white';
  ctx.fillRect(
    platformX,
    canvas.height - platformHeight - platformY,
    platformWidth,
    platformHeight

  );
}

function drawBall() {

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

  if (lives === 2) {
    ball.color = 'yellow';
  }

  if (lives === 1) {
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
  drawLives();
  drawScore();
  movePlatform();

}

function drawLives() {

  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  if (lives === 3) {
    ctx.fillText('🤍 🤍 🤍', 10, 776);
  }
  if (lives === 2) {
    ctx.fillText('🤍 🤍', 10, 776);
  }
  if (lives === 1) {
    ctx.fillText('🤍', 10, 776);
  }

}

function movePlatform() {

  if (isMovingRight) {
    platformX <= canvas.width - platformWidth && (platformX += 10);
    !isPressed && ball.x <= canvas.width - platformWidth / 2 && (ball.x += 10);
  }

  if (isMovingLeft) {
    platformX > 0 && (platformX -= 10);
    !isPressed && ball.x >= platformWidth / 2 && (ball.x -= 10);
  }

}
let currentScore = bricks.length;

function drawScore() {

  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(
    `score ${currentScore} / ${score}`,
    canvas.width - 100,
    canvas.height - 35
  );
  ctx.fillText(`points ${points}`, canvas.width - 100, canvas.height - 13);

}
function jumpBall() {

  if (ballRandom === 0) ballRandom = -1;

  ctx.beginPath();
  ball.y -= ball.delta;
  ball.x += ballRandom * ballSpeed;
  ctx.stroke();
  ctx.closePath();

}
function checkCollision() {

  for (let i = 0; i < bricks.length; i++) {
    const b = bricks[i];
    const deltaX = ball.x - Math.max(b.x, Math.min(ball.x, b.x + b.width));
    const deltaY = ball.y - Math.max(b.y, Math.min(ball.y, b.y + b.height));
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance <= ball.radius) {

      if (b.type !== 'unbreakable') {
        bricks.splice(i, 1);
        score++;
        points += Math.trunc(b.width * score);

      }

      const angle = Math.atan2(deltaY, deltaX);
      const collisionAngle = Math.abs(angle);

      if (collisionAngle > Math.PI / 4 && collisionAngle < (3 * Math.PI) / 4) {
        ball.delta *= -1;
      } else {
        ballRandom *= -1;
      }

      break;
    }

  }
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ballRandom *= -1;
  }

  if (
    ball.y + ball.radius >= canvas.height - platformHeight - platformY &&
    ball.y - ball.radius <= canvas.height - platformY &&
    ball.x + ball.radius >= platformX &&
    ball.x - ball.radius <= platformX + platformWidth
  ) {

    if (ball.y + ball.radius <= canvas.height - platformY) {
      ball.delta = -ball.delta;
      ball.y = canvas.height - platformHeight - platformY - ball.radius;
    } else if (ball.x <= platformX + ball.radius) {
      ballRandom = -ballRandom;
      ball.x = platformX - ballSpeed - ball.radius;
    } else if (ball.x - ball.radius >= platformX + platformWidth / 2) {
      ballRandom = -ballRandom;
      ball.x = platformX + platformWidth + ballSpeed + ball.radius;
    }

  }

  if (ball.y - ball.radius <= 0) {
    ball.delta = -ball.delta;
    ball.y = ball.radius;
  }

}

document.addEventListener('keydown', (e) => {

  if (e.key === 'ArrowRight' || e.key === 'd') {
    isMovingRight = true;

    if (!isPressed) {
      draw();
    }

  }
  if (e.key === 'ArrowLeft' || e.key === 'lives') {

    isMovingLeft = true;

    if (!isPressed) {
      draw();
    }

  }

  if (e.key === ' ' && !isPressed) {

    isPressed = true;
    loop();

  }
});

document.addEventListener('keyup', (e) => {

  if (e.key === 'ArrowRight' || e.key === 'd') {
    isMovingRight = false;
  }

  if (e.key === 'ArrowLeft' || e.key === 'lives') {
    isMovingLeft = false;
  }

});

canvas.addEventListener('mousemove', (e) => {

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;

  const minPlatformX = 0;
  const maxPlatformX = canvas.width - platformWidth;

  platformX = Math.max(
    minPlatformX,
    Math.min(mouseX - platformWidth / 2, maxPlatformX)
  );

});

function reload() {

  bricks = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  levelOneGeneration();

  platformX = (canvas.width - platformWidth) / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - platformHeight - platformY - ballRadius;
  isPressed = false;
  lives = 3;
  score = 0;
  points = 0;
  level = 0;
  currentScore = bricks.length;
  ball.color = 'green';
  draw();
}

function loop() {
  
  animationId = requestAnimationFrame(loop);

  draw();
  checkCollision();

  if (ball.y + ball.radius >= canvas.height) {

    points -= 1000;

    if (lives === 1) {

      isTryAgain = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '70px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('lav ches xaxum axper jan', 250, 410);
      ctx.fillText('sxmi noric xaxa', 350, 480);
      canvas.addEventListener('click', () => {

        if (!isTryAgain) {

          return;
        }

        reload();
        isTryAgain = false;
      });

      cancelAnimationFrame(animationId);
    } else {
      lives--;
      platformX = (canvas.width - platformWidth) / 2;
      ball.x = canvas.width / 2;
      ball.y = canvas.height - platformHeight - platformY - ballRadius;
      isPressed = false;
      draw();
      cancelAnimationFrame(animationId);
    }

  }

  if (level === 1) {

    levelTwoGeneration();
    currentScore = bricks.length.filter((e) => e.type !== 'unbreakable');

  }

  if (bricks.length === 0) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (level === 0) {
      level = 1;

    }
    draw();

  }

  if (bricks.filter((e) => e.type !== 'unbreakable').length === 0) {

    if (level === 1) {

      ballSpeed = 7;
      score = 0;
      bricks = [];

    }
  }

  if (
    level === 2 &&
    bricks.filter((b) => b.type !== 'unbreakable').length === 0
  ) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '70px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Verjapes haxtecirs', 300, 410);
    ctx.fillText(`Qo miavorn e ${points}`, 300, 500);
    cancelAnimationFrame(animationId);

  }

  if (isPressed) {
    jumpBall();
  }

  if (!isPressed) {
    cancelAnimationFrame(animationId);
  }
  
}

!isPressed && draw();
