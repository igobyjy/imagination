// ==================== 修复1：提前获取所有DOM元素 ====================
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const gameOverOverlay = document.getElementById('gameOverOverlay'); // 游戏结束覆盖层
const gameOverText = document.getElementById('gameOverText');       // 游戏结束文字
const restartBtn = document.getElementById('restartBtn');           // 重新开始按钮
const startBtn = document.getElementById('startBtn');               // 开始按钮
const pauseBtn = document.getElementById('pauseBtn');               // 暂停按钮

// ==================== 游戏配置（保持优化后参数） ====================
const CONFIG = {
    WIDTH: canvas.width,
    HEIGHT: canvas.height,
    PADDLE_WIDTH: 12,
    PADDLE_HEIGHT: 120,
    BALL_SIZE: 16,
    BASE_PADDLE_SPEED: 5,
    MAX_BALL_SPEED: 10,
    DIFFICULTY: 'easy',
    COMBO_MULTIPLIER: 1.2,
    WIN_SCORE: 7,
    AI_REACTION_DELAY: 80,
    AI_MAX_ERROR: 30
};

// ==================== 游戏状态 ====================
let gameState = 'start';
let playerScore = 0;
let aiScore = 0;
let comboCount = 0;

// ==================== 元素属性 ====================
let player = { /* ...（保持不变）... */ };
let ai = { /* ...（保持不变）... */ };
let ball = { /* ...（保持不变）... */ };

// ==================== 音效系统 ====================
const sounds = { /* ...（保持不变）... */ };

// ==================== 初始化游戏 ====================
function init() {
    resizeCanvas();
    resetBall();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', startGame); // 修复1：使用已声明的restartBtn
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => setDifficulty(btn.dataset.level));
    });

    gameLoop();
}

// ==================== 核心功能 ====================
function resizeCanvas() { /* ...（保持不变）... */ }

function handleMouseMove(e) { /* ...（保持不变）... */ }

function handleKeyDown(e) { /* ...（保持不变）... */ }

function handleKeyUp(e) { /* ...（保持不变）... */ }

function clampPlayer() { /* ...（保持不变）... */ }

// 修复4：统一startGame函数定义（仅保留一个）
function startGame() {
    gameState = 'playing';
    playerScore = 0;
    aiScore = 0;
    comboCount = 0;
    resetBall();
}

function togglePause() { /* ...（保持不变）... */ }

function setDifficulty(level) {
    CONFIG.DIFFICULTY = level;
    ai.speed = CONFIG.BASE_PADDLE_SPEED + 
              (level === 'easy' ? 0 : level === 'hard' ? 2 : 1);
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function resetBall() { /* ...（保持不变）... */ }

function update() {
    if (gameState !== 'playing') return;
    moveBall();
    moveAi();
    checkCollisions();
    checkWinCondition();
}

function moveBall() { /* ...（保持不变）... */ }

// 修复3：moveAi中使用ai.speed代替BASE_PADDLE_SPEED
function moveAi() {
    const aiCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y + ball.size / 2;
    const error = (Math.random() - 0.5) * CONFIG.AI_MAX_ERROR;
    const targetY = ballCenter + error;

    if (Math.abs(aiCenter - targetY) > CONFIG.AI_REACTION_DELAY) {
        const direction = aiCenter < targetY ? 1 : -1;
        ai.y += ai.speed * direction *  // 修复3：使用ai.speed
               (CONFIG.DIFFICULTY === 'hard' ? 1.1 : 
                CONFIG.DIFFICULTY === 'medium' ? 1.05 : 1);
    }
    clampAi();
}

function clampAi() { /* ...（保持不变）... */ }

function checkCollisions() { /* ...（保持不变）... */ }

function isColliding(obj1, obj2) { /* ...（保持不变）... */ }

function handlePaddleHit(playerType) { /* ...（保持不变）... */ }

// 修复2：删除外部的胜利条件判断，仅保留此处
function checkWinCondition() {
    // 得分检测
    if (ball.x + ball.size < 0) {
        aiScore++;
        comboCount = 0;
        sounds.score.play();
        resetBall();
        return;
    }
    if (ball.x > CONFIG.WIDTH) {
        playerScore++;
        comboCount = 0;
        sounds.score.play();
        resetBall();
        return;
    }

    // 胜利条件触发（仅保留此处）
    if (playerScore >= CONFIG.WIN_SCORE || aiScore >= CONFIG.WIN_SCORE) {
        const winner = playerScore > aiScore ? '玩家' : 'AI';
        showGameOver(winner);
    }
}

function showGameOver(winner) {
    gameOverText.textContent = `游戏结束！${winner} 获胜！\n最终比分：${playerScore} : ${aiScore}`;
    gameOverOverlay.style.display = 'flex';
    gameState = 'gameover';
}

function hideGameOver() {
    gameOverOverlay.style.display = 'none';
    startGame();
}

// ==================== 视觉效果 ====================
function draw() {
    // ...（保持不变）...
    // 绘制游戏结束覆盖层
    if (gameState === 'gameover') {
        gameOverOverlay.style.display = 'flex';
    } else {
        gameOverOverlay.style.display = 'none';
    }
}

function drawStartScreen() { /* ...（保持不变）... */ }

function drawPauseScreen() { /* ...（保持不变）... */ }

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 启动游戏
init();
