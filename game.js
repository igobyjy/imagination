      const canvas = document.getElementById('pongCanvas');
        const ctx = canvas.getContext('2d');

        // ==================== 游戏配置（优化后） ====================
        const CONFIG = {
            WIDTH: canvas.width,
            HEIGHT: canvas.height,
            PADDLE_WIDTH: 12,
            PADDLE_HEIGHT: 120, // 增加挡板高度
            BALL_SIZE: 16,      // 增大球体尺寸
            BASE_PADDLE_SPEED: 5, // 降低基础速度
            MAX_BALL_SPEED: 10, // 降低最大球速
            DIFFICULTY: 'easy', // 默认简单难度
            COMBO_MULTIPLIER: 1.2, // 降低连击影响
            WIN_SCORE: 7,       // 降低胜利分数
            AI_REACTION_DELAY: 80, // AI反应更慢
            AI_MAX_ERROR: 30    // AI偶尔漏球
        };

        // ==================== 游戏状态 ====================
        let gameState = 'start';
        let playerScore = 0;
        let aiScore = 0;
        let comboCount = 0;

        // ==================== 元素属性 ====================
        let player = {
            x: 20,
            y: CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2,
            width: CONFIG.PADDLE_WIDTH,
            height: CONFIG.PADDLE_HEIGHT,
            speed: CONFIG.BASE_PADDLE_SPEED
        };

        let ai = {
            x: CONFIG.WIDTH - 20 - CONFIG.PADDLE_WIDTH,
            y: CONFIG.HEIGHT / 2 - CONFIG.PADDLE_HEIGHT / 2,
            width: CONFIG.PADDLE_WIDTH,
            height: CONFIG.PADDLE_HEIGHT,
            speed: CONFIG.BASE_PADDLE_SPEED
        };

        let ball = {
            x: CONFIG.WIDTH / 2 - CONFIG.BALL_SIZE / 2,
            y: CONFIG.HEIGHT / 2 - CONFIG.BALL_SIZE / 2,
            size: CONFIG.BALL_SIZE,
            speedX: 0,
            speedY: 0,
            maxSpeed: CONFIG.MAX_BALL_SPEED
        };

        // ==================== 音效系统 ====================
        const sounds = {
            paddle: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqMkJKUlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/'),
            wall: new Audio('data:audio/wav;base64,UklGRlQFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWAFAACAg4eLj5GTl5qcnqCipKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/'),
            score: new Audio('data:audio/wav;base64,UklGRmQFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWAFAACAg4eLj5GTl5qcnqCipKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/')
        };

        // ==================== 初始化游戏 ====================
        function init() {
            resizeCanvas();
            resetBall();
            window.addEventListener('resize', resizeCanvas);
            canvas.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            
            document.getElementById('startBtn').addEventListener('click', startGame);
            document.getElementById('pauseBtn').addEventListener('click', togglePause);
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.addEventListener('click', () => setDifficulty(btn.dataset.level));
            });

            gameLoop();
        }

        // ==================== 核心功能 ====================
        function resizeCanvas() {
            canvas.width = CONFIG.WIDTH;
            canvas.height = CONFIG.HEIGHT;
            player.x = 20;
            ai.x = CONFIG.WIDTH - 20 - player.width;
        }

        function handleMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            player.y = e.clientY - rect.top - player.height / 2;
            clampPlayer();
        }

        function handleKeyDown(e) {
            if (e.key === 'w' || e.key === 'W') player.y -= player.speed;
            if (e.key === 's' || e.key === 'S') player.y += player.speed;
            if (e.key === 'p' || e.key === 'P') togglePause();
            clampPlayer();
        }

        function handleKeyUp(e) {}

        function clampPlayer() {
            player.y = Math.max(0, Math.min(CONFIG.HEIGHT - player.height, player.y));
        }

        function startGame() {
            gameState = 'playing';
            playerScore = 0;
            aiScore = 0;
            comboCount = 0;
            resetBall();
        }

        function togglePause() {
            gameState = gameState === 'paused' ? 'playing' : 'paused';
        }

        function setDifficulty(level) {
            CONFIG.DIFFICULTY = level;
            ai.speed = CONFIG.BASE_PADDLE_SPEED + 
                      (level === 'easy' ? 0 : level === 'hard' ? 2 : 1); // 简单模式无加速
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        }

        function resetBall() {
            ball.x = CONFIG.WIDTH / 2 - ball.size / 2;
            ball.y = CONFIG.HEIGHT / 2 - ball.size / 2;
            
            // 更简单的初始方向（固定向左/右）
            ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
            ball.speedY = (Math.random() - 0.5) * 4; // 小范围垂直速度
        }

        function update() {
            if (gameState !== 'playing') return;

            moveBall();
            moveAi();
            checkCollisions();
            checkWinCondition();
        }

        function moveBall() {
            ball.x += ball.speedX;
            ball.y += ball.speedY;

            // 上下边界碰撞（更柔和）
            if (ball.y <= 0 || ball.y + ball.size >= CONFIG.HEIGHT) {
                ball.speedY = -ball.speedY * 0.95; // 减少速度损失（原1→0.95）
                ball.y = ball.y <= 0 ? 0 : CONFIG.HEIGHT - ball.size;
                sounds.wall.play();
            }
        }

        function moveAi() {
            const aiCenter = ai.y + ai.height / 2;
            const ballCenter = ball.y + ball.size / 2;
            
            // 增加随机误差（AI偶尔漏球）
            const error = (Math.random() - 0.5) * CONFIG.AI_MAX_ERROR;
            const targetY = ballCenter + error;

            // 延迟跟随（非即时反应）
            if (Math.abs(aiCenter - targetY) > CONFIG.AI_REACTION_DELAY) {
                const direction = aiCenter < targetY ? 1 : -1;
                ai.y += CONFIG.BASE_PADDLE_SPEED * direction * 
                       (CONFIG.DIFFICULTY === 'hard' ? 1.1 : 
                        CONFIG.DIFFICULTY === 'medium' ? 1.05 : 1); // 简单模式无加速
            }

            clampAi();
        }

        function clampAi() {
            ai.y = Math.max(0, Math.min(CONFIG.HEIGHT - ai.height, ai.y));
        }

        function checkCollisions() {
            if (isColliding(ball, player)) handlePaddleHit('player');
            if (isColliding(ball, ai)) handlePaddleHit('ai');
        }

        function isColliding(obj1, obj2) {
            return obj1.x < obj2.x + obj2.width &&
                   obj1.x + obj1.size > obj2.x &&
                   obj1.y < obj2.y + obj2.height &&
                   obj1.y + obj1.size > obj2.y;
        }

        function handlePaddleHit(playerType) {
            // 简化反弹角度（固定45°方向）
            const paddleCenter = playerType === 'player' ? 
                player.y + player.height / 2 : 
                ai.y + ai.height / 2;
            const ballCenter = ball.y + ball.size / 2;
            
            // 固定垂直速度（原动态计算→更易预判）
            ball.speedY = (ballCenter > paddleCenter ? 1 : -1) * 4;

            // 降低球速加速幅度
            ball.speedX = -ball.speedX * 1.03;
            ball.speedX = Math.min(ball.maxSpeed, Math.abs(ball.speedX)) * Math.sign(ball.speedX);

            // 防卡挡板
            ball.x = playerType === 'player' ? 
                player.x + player.width : 
                ai.x - ball.size;

            sounds.paddle.play();
        }

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

            // 胜利条件：先得7分且领先2分
            if (playerScore >= CONFIG.WIN_SCORE || aiScore >= CONFIG.WIN_SCORE) {
                const winner = playerScore > aiScore ? '玩家' : 'AI';
                setTimeout(() => {
                    alert(`游戏结束！${winner} 获胜！\n最终比分：${playerScore} : ${aiScore}`);
                    startGame();
                }, 500);
            }
        }

        // ==================== 视觉效果 ====================
        function draw() {
            // 绘制渐变背景
            const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.HEIGHT);
            gradient.addColorStop(0, '#0a0a2a');
            gradient.addColorStop(1, '#1a1a4a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

            // 绘制中间虚线
            ctx.setLineDash([15, 20]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(CONFIG.WIDTH/2, 0);
            ctx.lineTo(CONFIG.WIDTH/2, CONFIG.HEIGHT);
            ctx.stroke();
            ctx.setLineDash([]);

            // 绘制玩家挡板（更明亮）
            const playerGradient = ctx.createLinearGradient(
                player.x, player.y, 
                player.x, player.y + player.height
            );
            playerGradient.addColorStop(0, '#4a90e2');
            playerGradient.addColorStop(1, '#2a52be');
            ctx.fillStyle = playerGradient;
            ctx.shadowColor = 'rgba(74, 144, 226, 0.5)';
            ctx.shadowBlur = 15;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.shadowBlur = 0;

            // 绘制AI挡板（更暗淡）
            const aiGradient = ctx.createLinearGradient(
                ai.x, ai.y, 
                ai.x, ai.y + ai.height
            );
            aiGradient.addColorStop(0, '#666');
            aiGradient.addColorStop(1, '#444');
            ctx.fillStyle = aiGradient;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';
            ctx.shadowBlur = 15;
            ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
            ctx.shadowBlur = 0;

            // 绘制球（更柔和发光）
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(
                ball.x + ball.size/2, 
                ball.y + ball.size/2, 
                ball.size/2, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
            ctx.shadowBlur = 0;

            // 绘制分数（更大字体）
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(playerScore, CONFIG.WIDTH/4, 60);
            ctx.fillText(aiScore, 3*CONFIG.WIDTH/4, 60);

            // 绘制游戏状态提示
            if (gameState === 'start') drawStartScreen();
            if (gameState === 'paused') drawPauseScreen();
        }

        function drawStartScreen() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            
            ctx.font = 'bold 60px Arial';
            ctx.fillStyle = '#4a90e2';
            ctx.textAlign = 'center';
            ctx.fillText('轻松乒乓球', CONFIG.WIDTH/2, CONFIG.HEIGHT/2 - 80);
            
            ctx.font = '36px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('点击"开始游戏"按钮开始', CONFIG.WIDTH/2, CONFIG.HEIGHT/2 + 20);
            
            ctx.font = '24px Arial';
            ctx.fillStyle = '#cccccc';
            ctx.fillText('使用鼠标或W/S键移动挡板 | 先得7分获胜', CONFIG.WIDTH/2, CONFIG.HEIGHT/2 + 70);
        }

        function drawPauseScreen() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            
            ctx.font = 'bold 60px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('游戏暂停', CONFIG.WIDTH/2, CONFIG.HEIGHT/2 - 40);
            
            ctx.font = '36px Arial';
            ctx.fillStyle = '#cccccc';
            ctx.fillText('按P键继续游戏', CONFIG.WIDTH/2, CONFIG.HEIGHT/2 + 40);
        }

        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // 启动游戏
        init();
