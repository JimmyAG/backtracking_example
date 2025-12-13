import { createQueenImage } from './utils';
export class Cell {
    constructor(boardColumnCount, column, row, boradMatrix) {
        this.boardMatrix = [[]];
        this.boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.boardMatrix = boradMatrix;
        this.column = column;
        this.row = row;
        this.columns = boardColumnCount;
        this.id = this.getIdFromMatrixCoords(this.row, this.column);
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
    getIdFromMatrixCoords(row, column) {
        return `${this.boardLetters[column]}${row + 1}`;
    }
    getMatrixCoordsFromSquare(squareId) {
        const row = Math.abs(parseInt(squareId[1]) - this.columns);
        const column = this.boardLetters.indexOf(squareId[0]);
        return { row, column };
    }
    isValidSquare() {
        // For some reason dragging over the same square the drag started from returns ''
        // so we check if it is not the same square are dragging the queen from
        const squareId = this.id;
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
    dropQueenOnBoard(e, square) {
        var _a, _b;
        e.preventDefault();
        const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
        const originParentId = (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData('origin-parent');
        if (data === 'queen') {
            if (!square.querySelector('.queen-image')) {
                const queen = createQueenImage('./q.png');
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
}
//# sourceMappingURL=cell.js.map