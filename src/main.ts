const initButton = document.getElementById('start-button')

class Board {
  private readonly rows: number
  private readonly columns: number
  private readonly boardLetters: string[]
  private readonly lightSqaurColor: string = '#f0d9b5'
  private readonly darkSqaurColor: string = '#b58863'
  private readonly boardMatrix: string[][] = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]

  //constructor function
  constructor(rows: number) {
    this.rows = rows
    this.columns = rows
    this.boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  }

  setBoardCoordinations(column: number, row: number) {
    const squareColour =
      (row + (column + 1)) % 2 === 0
        ? this.darkSqaurColor
        : this.lightSqaurColor

    const square = document.getElementById(
      `${this.boardLetters[column]}${row + 1}`
    )

    if (column === 7) {
      const squareNumber = document.createElement('p')
      squareNumber.innerHTML = `${row + 1}`
      squareNumber.style.color = squareColour
      squareNumber.style.alignSelf = 'flex-end'
      squareNumber.style.marginRight = '4px'

      square?.appendChild(squareNumber)
    }

    if (row === 0) {
      const alignDiv = document.createElement('div')
      alignDiv.style.position = 'relative'
      alignDiv.style.height = '100%'

      const squareLetter = document.createElement('p')

      alignDiv.appendChild(squareLetter)

      squareLetter.innerHTML = this.boardLetters[column]
      squareLetter.style.color = squareColour
      squareLetter.style.position = 'absolute'

      squareLetter.style.bottom = '1px'
      squareLetter.style.marginLeft = '4px'

      square?.appendChild(alignDiv)
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

    if (data === 'queen') {
      if (!square.querySelector('.queen-image')) {
        const alignDiv = document.createElement('div')
        alignDiv.style.position = 'relative'
        alignDiv.style.height = '100%'

        const queen = document.createElement('img')

        alignDiv.appendChild(queen)
        queen.src = './q.png'
        queen.className = 'queen-image'
        queen.draggable = true

        queen.style.position = 'absolute'
        queen.style.zIndex = '20'

        queen.addEventListener('dragstart', (dragEvent) => {
          dragEvent.dataTransfer?.setData('text/plain', 'queen-from-board')
          queen.classList.add('dragging')
        })

        queen.addEventListener('dragend', () => {
          queen.classList.remove('dragging')
        })

        square.appendChild(alignDiv)

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
      }
    } else if (data === 'queen-from-board') {
      const draggingQueen = document.querySelector('.dragging')
      if (draggingQueen && !square.querySelector('.queen-image')) {
        square.appendChild(draggingQueen)
      }
    }
  }

  init() {
    const chessBoardEl = document.getElementById('chess-board')
    const freePlayCheckbox = document.getElementById(
      'free-play'
    ) as HTMLInputElement
    const stockQueensNumber = document.getElementById('stock')
    const stockQueen = document.getElementById('draggable-queen')
    const stockArea = document.getElementById('stock-area')

    if (stockQueen) {
      stockQueen.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', 'queen')
      })
    } else {
      const queenImage = document.createElement('img')
      queenImage.id = 'draggable-queen'
      queenImage.className = 'queen-image'
      queenImage.draggable = true
      queenImage.src = './q.png'
      queenImage.style.display = 'inline'

      if (stockArea) stockArea.appendChild(queenImage)
    }

    if (stockQueensNumber) stockQueensNumber.innerText = '8'

    if (chessBoardEl) {
      chessBoardEl.style.border = 'solid 5px black'

      for (let row = 7; row >= 0; row--) {
        const newRank = document.createElement('div')
        newRank.style.display = 'flex'
        chessBoardEl.appendChild(newRank)

        for (let column = 0; column < this.columns; column++) {
          const square = document.createElement('div')
          square.style.width = '71px'
          square.style.height = '71px'
          square.style.display = 'flex'
          square.style.flexDirection = 'column'

          square.id = `${this.boardLetters[column]}${row + 1}`

          square.className =
            (row + (column + 1)) % 2 === 0 ? 'light-square' : 'dark-square'

          if (freePlayCheckbox && freePlayCheckbox.checked) {
            square.addEventListener('dragover', (e) => {
              e.preventDefault()
            })

            square.addEventListener('drop', (e) =>
              this.dropQueenOnBoard(e, square)
            )
          }

          newRank.appendChild(square)
          this.setBoardCoordinations(column, row)
        }
      }
    }

    if (stockArea) {
      stockArea.addEventListener('dragover', (e) => {
        e.preventDefault()
        stockArea.style.borderStyle = 'dotted'
      })

      stockArea.addEventListener('drop', (e) => this.dropQueenOnStockArea(e))
    }
  }
}

initButton?.addEventListener('click', () => {
  let chessBoard = document.getElementById('chess-board')
  if (chessBoard) {
    chessBoard.innerHTML = ''

    let newChessBoard = new Board(8)

    newChessBoard.init()
  }
})
