const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PADDLE_SPEED = 6;

// Player paddle
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// AI paddle
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Score (optional)
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY = -ballSpeedY;
        ballY = ballY <= 0 ? 0 : HEIGHT - BALL_SIZE;
    }

    // Paddle collision (player)
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add a little randomness
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = PADDLE_WIDTH; // Prevent sticking
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        ballSpeedY += (Math.random() - 0.5) * 2;
        ballX = WIDTH - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
    }

    // AI paddle movement (basic)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp within canvas
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + BALL_SIZE > WIDTH) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // player
    ctx.fillRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw center line
    ctx.strokeStyle = "#888";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, WIDTH / 4, 40);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 40);
}

// Start the game loop
gameLoop();
