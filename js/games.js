// ============================================
// TAP SPEED GAME
// ============================================
let tapGameState = {
    isRunning: false,
    clicks: 0,
    timeLeft: 10,
    totalTime: 10,
    interval: null
};

function startTapSpeed() {
    const startBtn = document.getElementById('tapStartBtn');
    startBtn.disabled = true;
    
    tapGameState.isRunning = true;
    tapGameState.clicks = 0;
    tapGameState.timeLeft = 10;
    
    document.getElementById('tapClicks').textContent = '0';
    document.getElementById('tapTime').textContent = '10';
    document.getElementById('tapButton').disabled = false;
    document.getElementById('tapResult').classList.add('hidden');
    
    tapGameState.interval = setInterval(() => {
        tapGameState.timeLeft--;
        document.getElementById('tapTime').textContent = tapGameState.timeLeft;
        
        if (tapGameState.timeLeft <= 0) {
            endTapSpeed();
        }
    }, 1000);
}

function tapClick() {
    if (tapGameState.isRunning) {
        tapGameState.clicks++;
        document.getElementById('tapClicks').textContent = tapGameState.clicks;
    }
}

function endTapSpeed() {
    clearInterval(tapGameState.interval);
    tapGameState.isRunning = false;
    
    document.getElementById('tapButton').disabled = true;
    document.getElementById('tapStartBtn').disabled = false;
    
    const resultDiv = document.getElementById('tapResult');
    resultDiv.innerHTML = `
        <h3>🎉 Fim do Jogo!</h3>
        <p>Você conseguiu <strong>${tapGameState.clicks}</strong> cliques em 10 segundos</p>
        <div class="score">${tapGameState.clicks}</div>
        <p>Velocidade: ${(tapGameState.clicks / 10).toFixed(1)} cliques/s</p>
    `;
    resultDiv.classList.remove('hidden');
    playSound();
}

// ============================================
// MEMORY GAME
// ============================================
let memoryGameState = {
    isRunning: false,
    cards: [],
    flipped: [],
    matched: 0,
    moves: 0,
    canClick: true
};

const emojis = ['🍎', '🍌', '🍇', '🍓', '🍎', '🍌', '🍇', '🍓'];

function startMemory() {
    const startBtn = document.getElementById('memoryStartBtn');
    startBtn.disabled = true;
    
    memoryGameState.isRunning = true;
    memoryGameState.cards = shuffleArray([...emojis]);
    memoryGameState.flipped = [];
    memoryGameState.matched = 0;
    memoryGameState.moves = 0;
    memoryGameState.canClick = true;
    
    document.getElementById('memoryPairs').textContent = '0/8';
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryResult').classList.add('hidden');
    
    renderMemoryGrid();
}

function renderMemoryGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    memoryGameState.cards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.textContent = '?';
        card.onclick = () => flipCard(index);
        grid.appendChild(card);
    });
}

function flipCard(index) {
    if (!memoryGameState.isRunning || !memoryGameState.canClick) return;
    if (memoryGameState.flipped.includes(index)) return;
    
    const cards = document.querySelectorAll('.memory-card');
    const card = cards[index];
    
    memoryGameState.flipped.push(index);
    card.classList.add('flipped');
    card.textContent = memoryGameState.cards[index];
    
    if (memoryGameState.flipped.length === 2) {
        memoryGameState.canClick = false;
        memoryGameState.moves++;
        document.getElementById('memoryMoves').textContent = memoryGameState.moves;
        
        setTimeout(() => {
            checkMemoryMatch();
        }, 600);
    }
}

function checkMemoryMatch() {
    const cards = document.querySelectorAll('.memory-card');
    const [index1, index2] = memoryGameState.flipped;
    
    if (memoryGameState.cards[index1] === memoryGameState.cards[index2]) {
        memoryGameState.matched++;
        cards[index1].classList.add('matched');
        cards[index2].classList.add('matched');
        playSound();
        
        document.getElementById('memoryPairs').textContent = `${memoryGameState.matched}/8`;
        
        if (memoryGameState.matched === 8) {
            endMemory();
            return;
        }
    } else {
        cards[index1].classList.remove('flipped');
        cards[index2].classList.remove('flipped');
        cards[index1].textContent = '?';
        cards[index2].textContent = '?';
    }
    
    memoryGameState.flipped = [];
    memoryGameState.canClick = true;
}

function endMemory() {
    memoryGameState.isRunning = false;
    document.getElementById('memoryStartBtn').disabled = false;
    
    const resultDiv = document.getElementById('memoryResult');
    resultDiv.innerHTML = `
        <h3>🎉 Você Venceu!</h3>
        <p>Completou em <strong>${memoryGameState.moves}</strong> movimentos</p>
        <div class="score">${memoryGameState.moves}</div>
        <p>Pares encontrados: 8/8</p>
    `;
    resultDiv.classList.remove('hidden');
}

// ============================================
// REACTION TIME GAME
// ============================================
let reactionGameState = {
    isRunning: false,
    round: 0,
    times: [],
    startTime: 0,
    waitingForClick: false
};

function startReaction() {
    const startBtn = document.getElementById('reactionStartBtn');
    startBtn.disabled = true;
    
    reactionGameState.isRunning = true;
    reactionGameState.round = 0;
    reactionGameState.times = [];
    
    document.getElementById('reactionResult').classList.add('hidden');
    nextReactionRound();
}

function nextReactionRound() {
    reactionGameState.round++;
    document.getElementById('reactionRound').textContent = `${reactionGameState.round}/5`;
    
    if (reactionGameState.round > 5) {
        endReaction();
        return;
    }
    
    const box = document.getElementById('reactionBox');
    const text = document.getElementById('reactionText');
    
    box.style.background = '#f0f0f0';
    text.textContent = 'Aguarde o sinal...';
    reactionGameState.waitingForClick = false;
    
    const delay = Math.random() * 3000 + 1000;
    setTimeout(() => {
        box.classList.add('active');
        text.textContent = 'CLIQUE AGORA!';
        reactionGameState.startTime = Date.now();
        reactionGameState.waitingForClick = true;
        playSound();
    }, delay);
    
    box.onclick = () => {
        if (reactionGameState.waitingForClick && reactionGameState.isRunning) {
            const reactionTime = Date.now() - reactionGameState.startTime;
            reactionGameState.times.push(reactionTime);
            reactionGameState.waitingForClick = false;
            
            box.classList.remove('active');
            box.style.background = '#90EE90';
            text.textContent = `${reactionTime}ms`;
            
            setTimeout(() => {
                nextReactionRound();
            }, 1500);
        }
    };
}

function endReaction() {
    reactionGameState.isRunning = false;
    document.getElementById('reactionStartBtn').disabled = false;
    
    const avgTime = Math.round(reactionGameState.times.reduce((a, b) => a + b, 0) / reactionGameState.times.length);
    document.getElementById('reactionAvg').textContent = avgTime;
    
    const resultDiv = document.getElementById('reactionResult');
    resultDiv.innerHTML = `
        <h3>🎉 Teste Concluído!</h3>
        <p>Tempo médio de reação</p>
        <div class="score">${avgTime}ms</div>
        <p>Melhor: ${Math.min(...reactionGameState.times)}ms | Pior: ${Math.max(...reactionGameState.times)}ms</p>
    `;
    resultDiv.classList.remove('hidden');
    
    document.getElementById('reactionBox').onclick = null;
}

// ============================================
// COLOR MATCH GAME
// ============================================
let colorMatchState = {
    isRunning: false,
    score: 0,
    timeLeft: 30,
    interval: null,
    targetColor: ''
};

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

function startColorMatch() {
    const startBtn = document.getElementById('colorStartBtn');
    startBtn.disabled = true;
    
    colorMatchState.isRunning = true;
    colorMatchState.score = 0;
    colorMatchState.timeLeft = 30;
    
    document.getElementById('colorScore').textContent = '0';
    document.getElementById('colorTime').textContent = '30';
    document.getElementById('colorResult').classList.add('hidden');
    
    renderColorGrid();
    selectNewColor();
    
    colorMatchState.interval = setInterval(() => {
        colorMatchState.timeLeft--;
        document.getElementById('colorTime').textContent = colorMatchState.timeLeft;
        
        if (colorMatchState.timeLeft <= 0) {
            endColorMatch();
        }
    }, 1000);
}

function selectNewColor() {
    colorMatchState.targetColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('colorTarget').style.backgroundColor = colorMatchState.targetColor;
}

function renderColorGrid() {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';
    
    colors.forEach((color) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = color;
        btn.onclick = () => {
            if (colorMatchState.isRunning) {
                if (color === colorMatchState.targetColor) {
                    colorMatchState.score++;
                    document.getElementById('colorScore').textContent = colorMatchState.score;
                    playSound();
                    selectNewColor();
                }
            }
        };
        grid.appendChild(btn);
    });
}

function endColorMatch() {
    clearInterval(colorMatchState.interval);
    colorMatchState.isRunning = false;
    
    document.getElementById('colorStartBtn').disabled = false;
    
    const resultDiv = document.getElementById('colorResult');
    resultDiv.innerHTML = `
        <h3>🎉 Fim do Jogo!</h3>
        <p>Você acertou <strong>${colorMatchState.score}</strong> cores</p>
        <div class="score">${colorMatchState.score}</div>
        <p>Velocidade: ${(colorMatchState.score / 30).toFixed(2)} acertos/s</p>
    `;
    resultDiv.classList.remove('hidden');
}

// ============================================
// FLAPPY BIRD GAME
// ============================================
let birdGameState = {
    isRunning: false,
    score: 0,
    bird: { x: 50, y: 200 },
    velocity: 0,
    gravity: 0.5,
    jumpPower: -12,
    pipes: [],
    pipeGap: 100,
    pipeWidth: 60,
    gameSpeed: 5
};

function startFlappyBird() {
    const startBtn = document.getElementById('birdStartBtn');
    startBtn.disabled = true;
    
    birdGameState.isRunning = true;
    birdGameState.score = 0;
    birdGameState.bird = { x: 50, y: 200 };
    birdGameState.velocity = 0;
    birdGameState.pipes = [];
    
    document.getElementById('birdScore').textContent = '0';
    document.getElementById('birdResult').classList.add('hidden');
    
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    
    document.addEventListener('click', jumpBird);
    document.addEventListener('space', jumpBird);
    
    function jumpBird(e) {
        if (birdGameState.isRunning && (e.code === 'Space' || e.type === 'click')) {
            birdGameState.velocity = birdGameState.jumpPower;
        }
    }
    
    function gameLoop() {
        // Update bird
        birdGameState.velocity += birdGameState.gravity;
        birdGameState.bird.y += birdGameState.velocity;
        
        // Generate pipes
        if (birdGameState.pipes.length === 0 || birdGameState.pipes[birdGameState.pipes.length - 1].x < canvas.width - 200) {
            const gapStart = Math.random() * (canvas.height - birdGameState.pipeGap - 50) + 30;
            birdGameState.pipes.push({
                x: canvas.width,
                gapStart: gapStart,
                scored: false
            });
        }
        
        // Update pipes
        birdGameState.pipes.forEach(pipe => {
            pipe.x -= birdGameState.gameSpeed;
            
            if (!pipe.scored && pipe.x + birdGameState.pipeWidth < birdGameState.bird.x) {
                pipe.scored = true;
                birdGameState.score++;
                document.getElementById('birdScore').textContent = birdGameState.score;
                playSound();
            }
        });
        
        // Remove off-screen pipes
        birdGameState.pipes = birdGameState.pipes.filter(pipe => pipe.x > -birdGameState.pipeWidth);
        
        // Check collisions
        if (birdGameState.bird.y < 0 || birdGameState.bird.y > canvas.height) {
            endFlappyBird(ctx, gameLoop);
            return;
        }
        
        birdGameState.pipes.forEach(pipe => {
            const birdRadius = 15;
            const birdLeft = birdGameState.bird.x - birdRadius;
            const birdRight = birdGameState.bird.x + birdRadius;
            const birdTop = birdGameState.bird.y - birdRadius;
            const birdBottom = birdGameState.bird.y + birdRadius;
            
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + birdGameState.pipeWidth;
            const pipeTopEnd = pipe.gapStart;
            const pipeBottomStart = pipe.gapStart + birdGameState.pipeGap;
            
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < pipeTopEnd || birdBottom > pipeBottomStart) {
                    endFlappyBird(ctx, gameLoop);
                    return;
                }
            }
        });
        
        // Draw
        ctx.fillStyle = 'linear-gradient(to bottom, #87ceeb, #e0f6ff)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw pipes
        ctx.fillStyle = '#2ecc71';
        birdGameState.pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, birdGameState.pipeWidth, pipe.gapStart);
            ctx.fillRect(pipe.x, pipe.gapStart + birdGameState.pipeGap, birdGameState.pipeWidth, canvas.height - pipe.gapStart - birdGameState.pipeGap);
        });
        
        // Draw bird
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(birdGameState.bird.x, birdGameState.bird.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(birdGameState.bird.x + 5, birdGameState.bird.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        if (birdGameState.isRunning) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    gameLoop();
}

function endFlappyBird(ctx, gameLoop) {
    birdGameState.isRunning = false;
    document.getElementById('birdStartBtn').disabled = false;
    
    const resultDiv = document.getElementById('birdResult');
    resultDiv.innerHTML = `
        <h3>💥 Você Colidiu!</h3>
        <p>Pontuação final</p>
        <div class="score">${birdGameState.score}</div>
        <p>Canos ultrapassados: ${birdGameState.score}</p>
    `;
    resultDiv.classList.remove('hidden');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function playSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}