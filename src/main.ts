const initButton = document.getElementById('start-button')

class Board {
  private readonly rows: number
  private readonly columns: number
  private readonly boardLetters: string[]
  private readonly lightSqaurColor: string = '#f0d9b5'
  private readonly darkSqaurColor: string = '#b58863'
  private readonly boardMatrix: string[][] = [[]]

  //constructor function
  constructor(rows: number) {
    this.rows = rows
    this.columns = rows
    this.boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    this.boardMatrix = Array.from({ length: this.columns }, () =>
      Array.from({ length: this.columns }, () => '')
    )
  }

  checkColumn(column: number) {
    for (let i = 0; i < this.boardMatrix.length; i++) {
      if (this.boardMatrix[i][column] === 'Q') {
        return false
      }
    }

    return true
  }

  checkDiagonals(row: number, column: number) {
    const n = this.boardMatrix.length

    // Check positive diagonal (top-left to bottom-right)
    let i = row - 1
    let j = column - 1
    while (i >= 0 && j >= 0) {
      if (this.boardMatrix[i][j] === 'Q') {
        return false
      }
      i--
      j--
    }

    i = row + 1
    j = column + 1
    while (i < n && j < n) {
      if (this.boardMatrix[i][j] === 'Q') {
        return false
      }
      i++
      j++
    }

    // Check negative diagonal (top-right to bottom-left)
    i = row - 1
    j = column + 1
    while (i >= 0 && j < n) {
      if (this.boardMatrix[i][j] === 'Q') {
        return false
      }
      i--
      j++
    }

    i = row + 1
    j = column - 1
    while (i < n && j >= 0) {
      if (this.boardMatrix[i][j] === 'Q') {
        return false
      }
      i++
      j--
    }

    return true
  }

  getIdFromMatrixCoords(row: number, column: number) {
    return `${this.boardLetters[column]}${row + 1}`
  }

  getMatrixCoordsFromSquare(squareId: string) {
    const row = Math.abs(parseInt(squareId[1]) - this.columns)
    const column = this.boardLetters.indexOf(squareId[0])

    return { row, column }
  }

  isValidSquare(squareId: string) {
    // For some reason dragging over the same square the drag started from returns ''
    // so we check if it is not the same square are dragging the queen from
    if (squareId !== '') {
      const coords = this.getMatrixCoordsFromSquare(squareId)
      const isValidCol = this.checkColumn(coords.column)
      const isValidRow = !this.boardMatrix[coords.row].includes('Q')
      const validDiagonals = this.checkDiagonals(coords.row, coords.column)

      // console.log(this.isValidSquare.toString().split('\n'))
      // console.trace(
      //   this.isValidSquare
      //     .toString()
      //     .split('\n')
      //     .map((line) => (!line.includes('//') ? line.trim() : undefined))
      // )
      if (isValidCol && isValidRow && validDiagonals) {
        return true
      } else {
        const square = document.getElementById(squareId)
        console.log('Not Available', squareId)
        if (square) {
          square.style.backgroundColor = 'red'
          square.style.opacity = '0.5'
        }
      }

      return false
    }
  }

  // checkBoardMatrix() {}
  updateBoardMatrix(square: HTMLDivElement) {}

  setBoardCoordinations(column: number, row: number) {
    const squareColour =
      (row + (column + 1)) % 2 === 0
        ? this.darkSqaurColor
        : this.lightSqaurColor

    const squareId = this.getIdFromMatrixCoords(row, column)
    const square = document.getElementById(squareId)

    if (column === this.columns - 1) {
      const squareNumber = document.createElement('p')
      squareNumber.innerHTML = `${row + 1}`
      squareNumber.style.color = squareColour
      squareNumber.style.alignSelf = 'flex-end'
      squareNumber.style.marginRight = '4px'

      square?.appendChild(squareNumber)
    }

    if (row === 0) {
      const squareLetter = document.createElement('p')

      squareLetter.innerHTML = this.boardLetters[column]
      squareLetter.style.color = squareColour

      squareLetter.style.bottom = '1px'
      squareLetter.style.marginLeft = '4px'
      squareLetter.style.marginTop = 'auto'

      square?.appendChild(squareLetter)
    }
  }

  dropQueenOnStockArea(e: DragEvent) {
    e.preventDefault()

    const data = e.dataTransfer?.getData('text/plain')

    if (data === 'queen-from-board') {
      const draggingQueen = document.querySelector('.dragging')

      if (draggingQueen) {
        draggingQueen.remove()

        const stockSpan = document.getElementById('stock')

        if (stockSpan) {
          let stock = parseInt(stockSpan.textContent || '0')
          stock++
          stockSpan.textContent = stock.toString()
          const stockQueen = document.getElementById('draggable-queen')
          if (stock > 0 && stockQueen && stockQueen.style.display === 'none') {
            stockQueen.style.display = ''
          }
        }
      }
    }
  }

  dropQueenOnBoard(e: DragEvent, square: HTMLDivElement) {
    e.preventDefault()
    const data = e.dataTransfer?.getData('text/plain')
    const originParentId = e.dataTransfer?.getData('origin-parent') as string

    if (data === 'queen') {
      if (!square.querySelector('.queen-image')) {
        const queen = document.createElement('img')

        queen.src = './q.png'
        queen.className = 'queen-image'
        queen.draggable = true

        queen.style.position = 'absolute'
        queen.style.transform = 'translate(8%, 8%)'
        queen.style.zIndex = '20'

        queen.addEventListener('dragstart', (dragEvent) => {
          dragEvent.dataTransfer?.setData('text/plain', 'queen-from-board')
          dragEvent.dataTransfer?.setData('origin-parent', square.id)
          queen.classList.add('dragging')
        })

        queen.addEventListener('dragend', () => {
          queen.classList.remove('dragging')
        })

        square.appendChild(queen)

        // Update stock
        const stockSpan = document.getElementById('stock')

        if (stockSpan) {
          let stock = parseInt(stockSpan.textContent || '8')
          stock--
          stockSpan.textContent = stock.toString()
          const stockQueen = document.getElementById('draggable-queen')

          if (stock === 0 && stockQueen) {
            stockQueen.style.display = 'none'
          }
        }

        // Update Matrix
        const coords = this.getMatrixCoordsFromSquare(square.id)
        this.boardMatrix[coords.row][coords.column] = 'Q'
      }
    } else if (data === 'queen-from-board') {
      const draggingQueen = document.querySelector('.dragging')

      if (draggingQueen && !square.querySelector('.queen-image')) {
        square.appendChild(draggingQueen)

        const originalCoords = this.getMatrixCoordsFromSquare(originParentId)
        this.boardMatrix[originalCoords.row][originalCoords.column] = ''

        const newCoords = this.getMatrixCoordsFromSquare(square.id)
        this.boardMatrix[newCoords.row][newCoords.column] = 'Q'

        this.boardMatrix[originalCoords.row][originalCoords.column] = ''
      }
    }

    console.log(this.boardMatrix)
  }

  init() {
    const chessBoardEl = document.getElementById('chess-board')
    const freePlayCheckbox = document.getElementById(
      'free-play'
    ) as HTMLInputElement
    const stockQueensNumber = document.getElementById('stock')
    const stockQueen = document.getElementById('draggable-queen')
    const stockArea = document.getElementById('stock-area')

    if (stockQueen)
      stockQueen.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', 'queen')
      })

    if (stockQueensNumber) stockQueensNumber.innerText = `${this.columns}`

    if (chessBoardEl) {
      chessBoardEl.style.width = 'min-content'
      chessBoardEl.style.border = 'solid 5px black'

      for (let row = this.columns - 1; row >= 0; row--) {
        const newRank = document.createElement('div')
        newRank.style.display = 'flex'
        chessBoardEl.appendChild(newRank)

        for (let column = 0; column < this.columns; column++) {
          const square = document.createElement('div')
          square.style.width = '71px'
          square.style.height = '71px'
          square.style.display = 'flex'
          square.style.flexDirection = 'column'

          square.id = this.getIdFromMatrixCoords(row, column) //`${this.boardLetters[column]}${row + 1}`

          square.className =
            (row + (column + 1)) % 2 === 0 ? 'light-square' : 'dark-square'

          square.addEventListener('dragover', (e) => {
            e.preventDefault()
            const targetSquareId = (e.target as any).id

            this.isValidSquare(targetSquareId)
          })

          square.addEventListener('dragleave', (e) => {
            e.preventDefault()
          })

          if (freePlayCheckbox && freePlayCheckbox.checked) {
            square.addEventListener('drop', (e) =>
              this.dropQueenOnBoard(e, square)
            )

            square.addEventListener('dragstart', (dragEvent) => {
              dragEvent.dataTransfer?.setData('text/plain', 'queen-from-board')
              dragEvent.dataTransfer?.setData('origin-parent', square.id)

              const originalCoords = this.getMatrixCoordsFromSquare(square.id)
              this.boardMatrix[originalCoords.row][originalCoords.column] = ''
            })
          }

          newRank.appendChild(square)
          this.setBoardCoordinations(column, row)
        }
      }
    }

    if (stockArea) {
      stockArea.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      stockArea.addEventListener('drop', (e) => this.dropQueenOnStockArea(e))
    }
  }
}

initButton?.addEventListener('click', () => {
  const NofQueensElement = document.getElementById(
    'set-queen-number'
  ) as HTMLInputElement
  const selectedQueenNumber = parseInt(NofQueensElement.value)

  let chessBoard = document.getElementById('chess-board')

  if (chessBoard) {
    chessBoard.innerHTML = ''

    let newChessBoard = new Board(selectedQueenNumber)

    newChessBoard.init()
  }
})
