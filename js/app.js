// ============================================
// APP.JS - Controlador Principal
// ============================================

function selectGame(gameName) {
    // Hide menu
    document.getElementById('mainMenu').classList.add('hidden');
    
    // Show selected game
    switch(gameName) {
        case 'tapSpeed':
            document.getElementById('tapSpeedGame').classList.remove('hidden');
            break;
        case 'memory':
            document.getElementById('memoryGame').classList.remove('hidden');
            break;
        case 'reaction':
            document.getElementById('reactionGame').classList.remove('hidden');
            break;
        case 'colorMatch':
            document.getElementById('colorMatchGame').classList.remove('hidden');
            break;
        case 'flappyBird':
            document.getElementById('flappyBirdGame').classList.remove('hidden');
            break;
    }
}

function backToMenu() {
    // Hide all games
    document.getElementById('tapSpeedGame').classList.add('hidden');
    document.getElementById('memoryGame').classList.add('hidden');
    document.getElementById('reactionGame').classList.add('hidden');
    document.getElementById('colorMatchGame').classList.add('hidden');
    document.getElementById('flappyBirdGame').classList.add('hidden');
    
    // Stop any running games
    if (tapGameState.isRunning) {
        clearInterval(tapGameState.interval);
        tapGameState.isRunning = false;
        document.getElementById('tapStartBtn').disabled = false;
    }
    
    if (memoryGameState.isRunning) {
        memoryGameState.isRunning = false;
        document.getElementById('memoryStartBtn').disabled = false;
    }
    
    if (reactionGameState.isRunning) {
        reactionGameState.isRunning = false;
        document.getElementById('reactionStartBtn').disabled = false;
        document.getElementById('reactionBox').onclick = null;
    }
    
    if (colorMatchState.isRunning) {
        clearInterval(colorMatchState.interval);
        colorMatchState.isRunning = false;
        document.getElementById('colorStartBtn').disabled = false;
    }
    
    if (birdGameState.isRunning) {
        birdGameState.isRunning = false;
        document.getElementById('birdStartBtn').disabled = false;
    }
    
    // Show menu
    document.getElementById('mainMenu').classList.remove('hidden');
}