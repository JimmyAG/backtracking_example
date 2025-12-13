"use strict";
class Board {
    //constructor function
    constructor(delay, rows) {
        this.lightSqaurColor = '#f0d9b5';
        this.darkSqaurColor = '#b58863';
        this.delay = 1000;
        this.solutionFound = false;
        this.boardMatrix = [[]];
        this.delay = delay;
        this.columns = rows;
        this.boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.boardMatrix = Array.from({ length: this.columns }, () => Array.from({ length: this.columns }, () => ''));
        this.solutions = [];
    }
    async addDelay(delayInMs) {
        return new Promise((resolve) => setTimeout(resolve, delayInMs));
    }
    setElementHeightBasedOnBoardSize(htmlElement, numberOfQueens) {
        if (htmlElement) {
            switch (numberOfQueens) {
                case 8:
                    htmlElement.style.maxHeight = '630px';
                    break;
                case 7:
                    htmlElement.style.maxHeight = '560px';
                    break;
                case 6:
                    htmlElement.style.maxHeight = '490px';
                    break;
                case 5:
                    htmlElement.style.maxHeight = '440px';
                    break;
                default:
                    htmlElement.style.maxHeight = '360px';
                    break;
            }
        }
    }
    highlightCodeLine(line, topMargin) {
        let lineHighlight = document.getElementById('highlighted');
        const preElement = document.getElementById('code-block');
        if (!lineHighlight) {
            lineHighlight = document.createElement('div');
            lineHighlight.id = 'highlighted';
            lineHighlight.className = 'line-highlight';
            lineHighlight.setAttribute('aria-hidden', 'true');
            lineHighlight.style.height = '26px';
            preElement === null || preElement === void 0 ? void 0 : preElement.appendChild(lineHighlight);
        }
        lineHighlight.style.top = `${line * 25.5 + topMargin}px`;
    }
    async markLine(line, delay) {
        this.highlightCodeLine(line, 4);
        if (delay)
            await this.addDelay(delay);
    }
    addCallToStack(row, col) {
        const NofQueensElement = document.getElementById('set-queen-number');
        const selectedQueenNumber = parseInt(NofQueensElement.value);
        const functionCall = document.createElement('div');
        functionCall.id = this.getIdFromMatrixCoords(row || 0, col || 0);
        functionCall.classList.add('stack-item');
        functionCall.textContent = `Solver(${row}), row: ${row || ''}, col: ${col || ''}`;
        functionCall.classList.add('fade-in');
        const stackElement = document.getElementById('stack');
        if (stackElement) {
            stackElement.appendChild(functionCall);
            requestAnimationFrame(() => {
                functionCall.classList.add('fade-in');
            });
            this.setElementHeightBasedOnBoardSize(stackElement, selectedQueenNumber);
        }
    }
    createQueenImage(imageSrc) {
        const queen = document.createElement('img');
        queen.src = imageSrc; // './q.png'
        queen.className = 'queen-image';
        queen.draggable = true;
        queen.style.position = 'absolute';
        queen.style.transform = 'translate(8%, 8%)';
        queen.style.zIndex = '20';
        return queen;
    }
    async solver(row) {
        const stack = document.getElementById('stack');
        const solveButton = document.getElementById('solve-button');
        solveButton.disabled = true;
        solveButton.style.cursor = 'not-allowed';
        solveButton.classList.add('cursor-not-allowed', 'opacity-50');
        await this.markLine(1, this.delay);
        if (row === this.columns) {
            this.solutions.push(this.boardMatrix.map((row) => [...row]));
            this.solutionFound = true;
            await this.markLine(3, this.delay / 2);
            return;
        }
        for (let col = 0; col < this.columns; col++) {
            await this.markLine(6, this.delay / 2);
            const squareId = this.getIdFromMatrixCoords(Math.abs(row + 1 - this.columns), col);
            const square = document.getElementById(squareId);
            await this.markLine(11);
            if (this.isValidSquare(squareId)) {
                await this.addDelay(this.delay / 3);
                square === null || square === void 0 ? void 0 : square.classList.add('highlightGreen');
                this.boardMatrix[row][col] = 'Q';
                const queenImage = this.createQueenImage('./q.png');
                if (this.delay > 0)
                    await this.addDelay(this.delay / 2);
                square === null || square === void 0 ? void 0 : square.classList.remove('highlightGreen');
                square === null || square === void 0 ? void 0 : square.appendChild(queenImage);
                this.addCallToStack(row + 1, col + 1);
                if (this.delay > 0)
                    await this.addDelay(this.delay);
                await this.markLine(13, this.delay / 3);
                await this.solver(row + 1);
                await this.markLine(15, this.delay / 2);
                if (this.solutionFound) {
                    const lastElement = stack === null || stack === void 0 ? void 0 : stack.lastElementChild;
                    lastElement.classList.add('fade-out');
                    stack === null || stack === void 0 ? void 0 : stack.removeChild(lastElement);
                    if (this.delay > 0)
                        await this.addDelay(this.delay / 2);
                    await this.markLine(16, this.delay / 3);
                    return;
                }
                await this.markLine(19, this.delay);
                this.boardMatrix[row][col] = ''; // Backtrack
                if (this.delay > 0)
                    await this.addDelay(this.delay / 2);
                square === null || square === void 0 ? void 0 : square.removeChild(queenImage);
                if (stack && stack.lastElementChild) {
                    const lastStackElement = stack.lastElementChild;
                    lastStackElement.classList.add('fade-out');
                    stack.removeChild(lastStackElement);
                }
                if (this.delay > 0)
                    await this.addDelay(this.delay / 2);
            }
            else {
                if (square) {
                    square.classList.add('highlight');
                    const angryQueenImage = this.createQueenImage('./q-angry.png');
                    square.appendChild(angryQueenImage);
                    if (this.delay > 0)
                        await this.addDelay(this.delay);
                    this.clearHighlights();
                    square.removeChild(angryQueenImage);
                }
            }
        }
    }
    checkColumn(column) {
        for (let i = 0; i < this.boardMatrix.length; i++) {
            if (this.boardMatrix[i][column] === 'Q') {
                return false;
            }
        }
        return true;
    }
    checkDiagonals(row, column) {
        const n = this.boardMatrix.length;
        // Check positive diagonal (top-left to bottom-right)
        let i = row - 1;
        let j = column - 1;
        while (i >= 0 && j >= 0) {
            if (this.boardMatrix[i][j] === 'Q') {
                return false;
            }
            i--;
            j--;
        }
        i = row + 1;
        j = column + 1;
        while (i < n && j < n) {
            if (this.boardMatrix[i][j] === 'Q') {
                return false;
            }
            i++;
            j++;
        }
        // Check negative diagonal (top-right to bottom-left)
        i = row - 1;
        j = column + 1;
        while (i >= 0 && j < n) {
            if (this.boardMatrix[i][j] === 'Q') {
                return false;
            }
            i--;
            j++;
        }
        i = row + 1;
        j = column - 1;
        while (i < n && j >= 0) {
            if (this.boardMatrix[i][j] === 'Q') {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }
    getIdFromMatrixCoords(row, column) {
        return `${this.boardLetters[column]}${row + 1}`;
    }
    getMatrixCoordsFromSquare(squareId) {
        const row = Math.abs(parseInt(squareId[1]) - this.columns);
        const column = this.boardLetters.indexOf(squareId[0]);
        return { row, column };
    }
    clearHighlights() {
        const squares = document.querySelectorAll('.highlight');
        squares.forEach((square) => {
            square.classList.remove('highlight');
        });
    }
    isValidSquare(squareId) {
        // For some reason dragging over the same square the drag started from returns ''
        // so we check if it is not the same square are dragging the queen from
        if (squareId !== '') {
            const coords = this.getMatrixCoordsFromSquare(squareId);
            const isValidCol = this.checkColumn(coords.column);
            const isValidRow = !this.boardMatrix[coords.row].includes('Q');
            const validDiagonals = this.checkDiagonals(coords.row, coords.column);
            if (isValidCol && isValidRow && validDiagonals) {
                return true;
            }
            else {
                const square = document.getElementById(squareId);
                if (square) {
                    square.classList.add('highlight');
                }
            }
        }
        return false;
    }
    setBoardCoordinations(column, row) {
        const squareColour = (row + (column + 1)) % 2 === 0
            ? this.darkSqaurColor
            : this.lightSqaurColor;
        const squareId = this.getIdFromMatrixCoords(row, column);
        const square = document.getElementById(squareId);
        if (column === this.columns - 1) {
            const squareNumber = document.createElement('p');
            squareNumber.innerHTML = `${row + 1}`;
            squareNumber.style.color = squareColour;
            squareNumber.style.alignSelf = 'flex-end';
            squareNumber.style.marginRight = '4px';
            square === null || square === void 0 ? void 0 : square.appendChild(squareNumber);
        }
        if (row === 0) {
            const squareLetter = document.createElement('p');
            squareLetter.innerHTML = this.boardLetters[column];
            squareLetter.style.color = squareColour;
            squareLetter.style.bottom = '1px';
            squareLetter.style.marginLeft = '4px';
            squareLetter.style.marginTop = 'auto';
            square === null || square === void 0 ? void 0 : square.appendChild(squareLetter);
        }
    }
    dropQueenOnStockArea(e) {
        var _a;
        e.preventDefault();
        const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        if (data === 'queen-from-board') {
            const draggingQueen = document.querySelector('.dragging');
            if (draggingQueen) {
                draggingQueen.remove();
                const stockSpan = document.getElementById('stock');
                if (stockSpan) {
                    let stock = parseInt(stockSpan.textContent || '0');
                    stock++;
                    stockSpan.textContent = stock.toString();
                    const stockQueen = document.getElementById('draggable-queen');
                    if (stock > 0 && stockQueen && stockQueen.style.display === 'none') {
                        stockQueen.style.display = '';
                    }
                }
            }
        }
    }
    dropQueenOnBoard(e, square) {
        var _a, _b;
        e.preventDefault();
        const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        const originParentId = (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData('origin-parent');
        if (data === 'queen') {
            if (!square.querySelector('.queen-image')) {
                const queen = this.createQueenImage('./q.png');
                queen.addEventListener('dragstart', (dragEvent) => {
                    var _a, _b;
                    (_a = dragEvent.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', 'queen-from-board');
                    (_b = dragEvent.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData('origin-parent', square.id);
                    queen.classList.add('dragging');
                });
                queen.addEventListener('dragend', () => {
                    queen.classList.remove('dragging');
                });
                square.appendChild(queen);
                // Update stock
                const stockSpan = document.getElementById('stock');
                if (stockSpan) {
                    let stock = parseInt(stockSpan.textContent || '8');
                    stock--;
                    stockSpan.textContent = stock.toString();
                    const stockQueen = document.getElementById('draggable-queen');
                    if (stock === 0 && stockQueen) {
                        stockQueen.style.display = 'none';
                    }
                }
                // Update Matrix
                const coords = this.getMatrixCoordsFromSquare(square.id);
                this.boardMatrix[coords.row][coords.column] = 'Q';
            }
        }
        else if (data === 'queen-from-board') {
            const draggingQueen = document.querySelector('.dragging');
            if (draggingQueen && !square.querySelector('.queen-image')) {
                square.appendChild(draggingQueen);
                const originalCoords = this.getMatrixCoordsFromSquare(originParentId);
                this.boardMatrix[originalCoords.row][originalCoords.column] = '';
                const newCoords = this.getMatrixCoordsFromSquare(square.id);
                this.boardMatrix[newCoords.row][newCoords.column] = 'Q';
                this.boardMatrix[originalCoords.row][originalCoords.column] = '';
            }
        }
        // console.log(this.boardMatrix)
    }
    init() {
        const chessBoardEl = document.getElementById('chess-board');
        const freePlayCheckbox = document.getElementById('free-play');
        const stockQueensNumber = document.getElementById('stock');
        const stockQueen = document.getElementById('draggable-queen');
        const stockArea = document.getElementById('stock-area');
        if (stockQueen)
            stockQueen.addEventListener('dragstart', (e) => {
                var _a;
                (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', 'queen');
            });
        if (stockQueensNumber)
            stockQueensNumber.innerText = `${this.columns}`;
        if (chessBoardEl) {
            chessBoardEl.style.width = 'min-content';
            chessBoardEl.style.border = 'solid 5px black';
            for (let row = this.columns - 1; row >= 0; row--) {
                const newRank = document.createElement('div');
                newRank.style.display = 'flex';
                chessBoardEl.appendChild(newRank);
                for (let column = 0; column < this.columns; column++) {
                    const square = document.createElement('div');
                    square.style.width = '71px';
                    square.style.height = '71px';
                    square.style.display = 'flex';
                    square.style.flexDirection = 'column';
                    square.id = this.getIdFromMatrixCoords(row, column);
                    square.className =
                        (row + (column + 1)) % 2 === 0 ? 'light-square' : 'dark-square';
                    square.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        if (freePlayCheckbox.checked) {
                            const targetSquareId = e.target.id;
                            this.isValidSquare(targetSquareId);
                        }
                    });
                    square.addEventListener('dragleave', (e) => {
                        e.preventDefault();
                        this.clearHighlights();
                    });
                    if (freePlayCheckbox && freePlayCheckbox.checked) {
                        this.boardMatrix = Array.from({ length: this.columns }, () => Array.from({ length: this.columns }, () => ''));
                        square.addEventListener('drop', (e) => {
                            if (freePlayCheckbox.checked) {
                                this.dropQueenOnBoard(e, square);
                            }
                        });
                        square.addEventListener('dragstart', (dragEvent) => {
                            var _a, _b;
                            if (freePlayCheckbox.checked) {
                                (_a = dragEvent.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', 'queen-from-board');
                                (_b = dragEvent.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData('origin-parent', square.id);
                                const originalCoords = this.getMatrixCoordsFromSquare(square.id);
                                this.boardMatrix[originalCoords.row][originalCoords.column] = '';
                            }
                        });
                    }
                    newRank.appendChild(square);
                    this.setBoardCoordinations(column, row);
                }
            }
        }
        if (stockArea) {
            stockArea.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            stockArea.addEventListener('drop', (e) => this.dropQueenOnStockArea(e));
        }
    }
}
const initButton = document.getElementById('start-button');
const solveButton = document.getElementById('solve-button');
let chessBoard = document.getElementById('chess-board');
let gameClass;
initButton === null || initButton === void 0 ? void 0 : initButton.addEventListener('click', () => {
    const NofQueensElement = document.getElementById('set-queen-number');
    const delayInputElement = document.getElementById('delay');
    const dealyInMs = parseInt(delayInputElement.value);
    const selectedQueenNumber = parseInt(NofQueensElement.value);
    if (chessBoard) {
        chessBoard.innerHTML = '';
        gameClass = new Board(dealyInMs, selectedQueenNumber);
        gameClass.init();
        if (solveButton) {
            solveButton.disabled = false;
            solveButton.style.cursor = 'pointer';
            solveButton.classList.remove('cursor-not-allowed', 'opacity-50');
            solveButton.classList.add('hover:bg-gray-200', 'active:bg-gray-300', 'transition-all');
        }
    }
});
solveButton === null || solveButton === void 0 ? void 0 : solveButton.addEventListener('click', async () => {
    if (chessBoard && gameClass) {
        await gameClass.solver(0);
        console.log(gameClass.boardMatrix);
    }
});
//# sourceMappingURL=main.js.map