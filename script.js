const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

const brickRowCount = Math.floor(Math.random() * 6) + 3;
const brickHeight = 60;
const bricks = [];
const platformWidth = 150;
const platformHeight = 20;
const platformY = 15
const ball = {
  x: canvas.width / 2,
  y: canvas.height - platformHeight - platformY - 15,
  radius: 15,
  color: 'green',
  delta: 7
};
const life = document.querySelector('.life')
const win = document.querySelector('.win')
const tryAgain = document.querySelector('.game-over')
let ballRandom = Math.trunc(Math.random() * 2) - 1;
let platformX = (canvas.width - platformWidth) / 2;
let isPressed = false;
let a = 3

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
  ctx.fillRect(platformX, canvas.height - platformHeight - platformY, platformWidth, platformHeight);
}


function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  if (a === 2) {
    ball.color = 'yellow'
  }
  if (a === 1) {
    ball.color = 'red'
  }
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.stroke
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall()
  drawPlatform()
  winGame()
}
function jumpBall() {
  if (ball.y + ball.radius >= canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.delta = -ball.delta;
  }

  if (!ballRandom) (ballRandom = Math.round(Math.random() * 2) - 1);
  ctx.beginPath();
  ball.y -= ball.delta;
  ball.x += ballRandom * 7;
  ctx.stroke();
}
function checkCollision() {
  for (let i = 0; i < bricks.length; i++) {
    const b = bricks[i];
    if (
      ball.x + ball.radius > b.x &&
      ball.x - ball.radius < b.x + b.width &&
      ball.y + ball.radius > b.y &&
      ball.y - ball.radius < b.y + b.height
    ) {
  
      bricks.splice(i, 1); 
      let ballTop = ball.y - ball.radius;
      let ballBottom = ball.y + ball.radius;
      let ballLeft = ball.x - ball.radius;
      let ballRight = ball.x + ball.radius;

      let collisionTop = ballBottom > b.y && ballTop < b.y;
      let collisionBottom = ballTop < b.y + b.height && ballBottom > b.y + b.height;
      let collisionLeft = ballRight > b.x && ballLeft < b.x;
      let collisionRight = ballLeft < b.x + b.width && ballRight > b.x + b.width;

      if ((collisionTop || collisionBottom) && !collisionLeft && !collisionRight) {
        ball.delta = -ball.delta; 
      } else if (!collisionTop && !collisionBottom && (collisionLeft || collisionRight)) {
        ballRandom *= -1; 
      } else {
        ball.delta = -ball.delta; 
        ballRandom *= -1; 
      }
      
      break;
    }
  }

  if (ball.x + ball.radius > canvas.width - ball.delta || ball.x - ball.radius < ball.delta) {
    ballRandom *= -1; 
  }

  if (
    ball.y + ball.radius >= canvas.height - platformHeight - platformY &&
    ball.x + ball.radius >= platformX &&
    ball.x - ball.radius <= platformX + platformWidth
  ) {
    ball.delta = -ball.delta;
    ball.y = canvas.height - platformHeight - platformY - ball.radius;
  }

  if (ball.y - ball.radius <= 0) {
    ball.delta = -ball.delta; 
  }
}



function winGame() {

}


document.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'ArrowRight' || e.key === 'd') {
    (platformX <= (canvas.width - platformWidth)) && (platformX += 20)
    !isPressed && ball.x <= canvas.width - ball.radius - platformWidth / 2 && (ball.x += 20)
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    (platformX >= 0) && (platformX -= 20)
    !isPressed && ball.x >= platformWidth / 2 && (ball.x -= 20)

  }
  if (e.key === ' ') {
    isPressed = true
  }
})

function tryAgainHandler() {
  location.reload()
}

function loop() {
  life.innerHTML = `<h1 class = "life__count">${a}</h1>`
  if (ball.y + ball.radius >= canvas.height) {
    if (a === 1) {
      tryAgain.innerHTML = `<h1 onclick = "tryAgainHandler()">tryAgain </h1>`
      return
    }
    else {
      a--

    }
  }

  requestAnimationFrame(loop)
  draw()
  if (isPressed === true) {
    jumpBall()
  }


  checkCollision()  
  if (bricks.length ==0) {
    win.innerHTML = '<h1 class="win__text">Uraaa</h1> '
    return
  }
}

loop();