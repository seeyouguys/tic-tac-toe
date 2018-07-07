const board = {
	cell: ['', '', '', '', '', '', '', '', ''],
	clear: function () {
		this.cell = ['', '', '', '', '', '', '', '', '']
		this.render()
	},
	render: function () {
		const board = this
		document.querySelectorAll('.cell').forEach(function (cellDiv, index) {
			cellDiv.textContent = board.cell[index]
		})
	},
	getWinner: function () {
		const c = this.cell
		let winner = null
		const waysToWin = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]]

		waysToWin.forEach(function (w) {			 // w is short for "way"
			if (c[w[0]] === c[w[1]] && c[w[0]] === c[w[2]]) {
				if (c[w[0]] === player.sign) {
					winner = player
				} else if (c[w[0]] === computer.sign) {
					winner = computer
				}
			}
		})
		return winner
	},
	getFreeCellsIndexes: function () {
		const board = this
		let freeCells = []
		for (let i = 0; i <= 8; i++) {
			if (board.cell[i] === '') {
				freeCells.push(i)
			}
		}
		return freeCells
	},
	getState: function () {
		const winner = this.getWinner()
		if (winner || this.getFreeCellsIndexes().length === 0) {
			if (winner === player) {
				colorControl.changeColor('win')
			} else if (winner === computer) {
				colorControl.changeColor('lose')
			} else {
				colorControl.changeColor('draw')
			}
			colorControl.highlightRestartButton()
			colorControl.colorWinWay()
			return 1
		} else {
			return null
		}	
	}
}

const player = {
	sign: 'X',
	makeMove: function (cellIndex) {
		board.cell[cellIndex] = this.sign
		console.log(`player played ${this.sign} at ${cellIndex}`)
	}
}

const computer = {
	sign: 'O',
	getRandomInt: function (min = 0, max = 9) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	makeMove: function (cellIndex) {
		board.cell[cellIndex] = this.sign
		console.log(`computer played ${this.sign} at ${cellIndex}`)
	},
	getChoice: function (freeCells) {
		let chosenCell = null
		
		// tries to defend
		freeCells.forEach(function (cellIndex) {
			board.cell[cellIndex] = player.sign
			if (board.getWinner() === player) {
				chosenCell = cellIndex
			}
			board.cell[cellIndex] = ''
		})
		
		// tries to win
		freeCells.forEach(function (cellIndex) {
			board.cell[cellIndex] = computer.sign
			if (board.getWinner() === computer) { 
				chosenCell = cellIndex
			}
			board.cell[cellIndex] = ''
		})

		if (chosenCell !== null) {
			return chosenCell
		} else {
			return freeCells[computer.getRandomInt(0, freeCells.length)]
		}
	}

}

const colorControl = { // to major Tom
	changeColor: function (state) {
		const header = document.querySelector('.main-header')
		header.classList.remove(header.classList[4])
		header.classList.add(state)
		header.remove()
		document.querySelector('.header-wrapper').appendChild(header)
	},
	highlightRestartButton: function () {
		document.querySelector('#reset-btn').classList.add('btn-primary')
	},
	unhighlightRestartButton: function () {
		document.querySelector('#reset-btn').classList.remove('btn-primary')
	},
	makeCellColorsNormal: function () {
		document.querySelectorAll('.cell').forEach(function (cellDiv) {
			cellDiv.classList.remove('colored')
		})
	},
	colorWinWay: function () {
		// finds the winway cells
		let winWay
		const waysToWin = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]]

		waysToWin.forEach(function (w) {
			const c = board.cell
			if (c[w[0]] === c[w[1]] && c[w[0]] === c[w[2]]) {
				winWay = w
			}
		})

		// recolors them
		winWay.forEach(function (cellIndex) {
			document.getElementById(cellIndex.toString()).classList.add('colored')
		})

		// rerenders all cells
		document.querySelectorAll('.row').forEach(function (row) {
			for (let i = 0; i <= 2; i++) {
				let elem = row.children[0]
				elem.remove()
				row.appendChild(elem)
			}
		})

	}
}

// Board click handler. Makes moves after the click
document.querySelector("#board").addEventListener("click", function (e) {
	const targetCellId = parseInt(e.target.id)
	let freeCells = board.getFreeCellsIndexes()
		
	if (freeCells.includes(targetCellId) && !isNaN(targetCellId) && !board.getState()) {	// target ID can be NaN if multiple cells were highlighted instead of one
		player.makeMove(targetCellId)
		board.render()

		
		freeCells = board.getFreeCellsIndexes()
		if (!board.getState()) {
			computer.makeMove(computer.getChoice(freeCells))
			setTimeout('board.render()', 250)
			board.getState()
		}
	}
})

// Button handlers
document.querySelector("#reset-btn").addEventListener("click", function (e) {
	board.clear()
	console.log("Board has been cleared")
	colorControl.changeColor('neutral')
	console.clear()
	colorControl.unhighlightRestartButton()
	colorControl.makeCellColorsNormal()
})
