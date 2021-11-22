let originalBoard
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cells = document.querySelectorAll('[data-cell')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
    winningMessageElement.classList.remove('show')
    originalBoard = Array.from(Array(9).keys())
    for (let i = 0; i < 9; i++) {
        cells[i].classList.remove(X_CLASS)
        cells[i].classList.remove(CIRCLE_CLASS)
        cells[i].removeEventListener('click', handleClick)
        cells[i].addEventListener('click', handleClick, { once: true })
    }
    winningMessageElement.classList.remove('show')
}

function handleClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
        turn(square.target.id, X_CLASS)
        if (!checkWin(originalBoard, X_CLASS) && !checkTie()) {
            turn(bestSpot(), CIRCLE_CLASS)
        }
    }
}

function turn(squareID, player) {
    originalBoard[squareID] = player
    document.getElementById(squareID).classList.add(player)
    let gameWon = checkWin(originalBoard, player)
    if (gameWon) {gameOver(gameWon)}
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, [])
    let gameWon = null
    for (let [index, win] of WINNING_COMBINATIONS.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player}
            break
        }
    }
    return gameWon
}


function gameOver(gameWon) {
    winningMessageTextElement.innerText = `${gameWon.player == X_CLASS ? "X's" : "O's"} Win!`
    winningMessageElement.classList.add('show')
}

function emptySquares() {
    return originalBoard.filter(s => typeof s == 'number')
}

function bestSpot() {
    return minimax(originalBoard, 0, CIRCLE_CLASS).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        winningMessageTextElement.innerText = 'Draw!'
        winningMessageElement.classList.add('show')
        return true
    } else {
        return false
    }
}

function minimax(newBoard, depth, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, X_CLASS)) {
		return {score: -10 - depth};
	} else if (checkWin(newBoard, CIRCLE_CLASS)) {
		return {score: 10 - depth};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == CIRCLE_CLASS) {
			var result = minimax(newBoard, depth + 1, X_CLASS);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, depth + 1, CIRCLE_CLASS);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === CIRCLE_CLASS) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}