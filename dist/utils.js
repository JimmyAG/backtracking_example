export const createQueenImage = (imageSrc) => {
    const queen = document.createElement('img');
    queen.src = imageSrc; // './q.png'
    queen.className = 'queen-image';
    queen.draggable = true;
    queen.style.position = 'absolute';
    queen.style.transform = 'translate(8%, 8%)';
    queen.style.zIndex = '20';
    return queen;
};
export const checkColumn = (boardMatrix, column) => {
    for (let i = 0; i < boardMatrix.length; i++) {
        if (boardMatrix[i][column] === 'Q') {
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=utils.js.map