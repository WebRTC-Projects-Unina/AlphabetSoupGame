// DOM Elements
const gridContainer = document.getElementById('grid');
const words = JSON.parse(localStorage.getItem('words')) || [];
const gridSize = parseInt(localStorage.getItem('gridSize'));
let currentSolution = [];
let foundWords = new Set();

// Fetch the puzzle from the server
fetch('/generatePuzzle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words, gridSize })
})
    .then(response => response.json())
    .then(data => {
        const { grid, solution } = data;
        currentSolution = solution;

        // Render the grid
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        grid.forEach((row, rowIndex) => {
            row.forEach((letter, colIndex) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = letter;
                cell.dataset.letter = letter;
                cell.dataset.x = colIndex;
                cell.dataset.y = rowIndex;
                gridContainer.appendChild(cell);
            });
        });
    })
    .catch(error => console.error('Error generating puzzle:', error));

// Highlight letters on click
gridContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        event.target.classList.toggle('highlighted');
    }
});

// Verify if the selected letters form a word
function verifyWord() {
    const highlightedCells = Array.from(document.querySelectorAll('.cell.highlighted'));
    const selectedWord = highlightedCells.map(cell => cell.textContent).join('').toUpperCase();

    // Ensure there's at least two highlighted cells
    if (highlightedCells.length < 2) {
        alert("Please select more than one letter.");
        return;
    }

    // Check if the selected word is in the word list
    if (!words.some(word => word.toUpperCase() === selectedWord)) {
        alert("Word not in the list. Try again.");
        return;
    }

    // Get the start and end positions of the selection
    const startX = parseInt(highlightedCells[0].dataset.x);
    const startY = parseInt(highlightedCells[0].dataset.y);
    const endX = parseInt(highlightedCells[highlightedCells.length - 1].dataset.x);
    const endY = parseInt(highlightedCells[highlightedCells.length - 1].dataset.y);

    // Check if the selection follows one of the three allowed directions (horizontal, vertical, diagonal)
    const isHorizontal = startY === endY && Math.abs(endX - startX) === highlightedCells.length - 1;
    const isVertical = startX === endX && Math.abs(endY - startY) === highlightedCells.length - 1;
    const isDiagonal = Math.abs(endX - startX) === Math.abs(endY - startY);

    // If the selection is not in one of the valid directions, alert the user
    if (!(isHorizontal || isVertical || isDiagonal)) {
        alert("Invalid selection direction. Please select in a straight line.");
        return;
    }

    // Verify if the selected word matches the word in the grid (consider direction)
    const direction = isHorizontal ? 'horizontal' : (isVertical ? 'vertical' : 'diagonal');
    if (checkWordInGrid(selectedWord, highlightedCells[0], direction)) {
        alert(`Correct! ${selectedWord} found.`);
        foundWords.add(selectedWord);

        // Mark the cells as confirmed and keep them highlighted
        highlightedCells.forEach(cell => {
            cell.classList.remove('highlighted');
            cell.classList.add('confirmed');
            cell.style.backgroundColor = 'yellow'; // Keep cells visually highlighted
        });

        // Check for victory condition
        if (foundWords.size === words.length) {
            alert("You found all the words! Redirecting to victory...");
            window.location.href = '/victory';
        }
    } else {
        alert("Incorrect selection. Try again.");
    }
}

// Function to check if the selected word matches the grid's word placement
function checkWordInGrid(word, startCell, direction) {
    const startX = parseInt(startCell.dataset.x);
    const startY = parseInt(startCell.dataset.y);
    const directions = {
        horizontal: { x: 1, y: 0 },
        vertical: { x: 0, y: 1 },
        diagonal: { x: 1, y: 1 }
    };

    const dir = directions[direction];
    let currentX = startX;
    let currentY = startY;

    // Loop through each letter of the word and check if it matches the grid's word
    for (let i = 0; i < word.length; i++) {
        const cell = document.querySelector(`.cell[data-x='${currentX}'][data-y='${currentY}']`);
        if (!cell || cell.textContent.toUpperCase() !== word[i]) {
            return false;  // Word doesn't match at this position
        }
        currentX += dir.x;
        currentY += dir.y;
    }
    return true;  // Word matches in the grid
}

// Show solution while holding the button
function showSolution(show) {
    const cells = document.querySelectorAll('.cell');

    if (show) {
        // Clear existing highlights first
        cells.forEach(cell => {
            cell.style.color = '';
            cell.style.backgroundColor = '';
        });

        // Highlight only the solution cells
        currentSolution.forEach(solution => {
            const { positions } = solution; // Use positions to highlight specific cells
            positions.forEach(({ x, y }) => {
                const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
                if (cell) {
                    cell.style.color = 'white'; // Make letter visible
                    cell.style.backgroundColor = 'blue'; // Optional: visually highlight
                }
            });
        });

        // Ensure already found words remain highlighted
        foundWords.forEach(word => {
            const solution = currentSolution.find(sol => sol.word === word);
            if (solution) {
                solution.positions.forEach(({ x, y }) => {
                    const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
                    if (cell) {
                        cell.style.backgroundColor = 'yellow'; // Use yellow for found words
                    }
                });
            }
        });
    } else {
        // Reset colors to default
        cells.forEach(cell => {
            cell.style.color = '';
            cell.style.backgroundColor = ''; // Clear all custom styles
        });

        // Keep already found words highlighted
        foundWords.forEach(word => {
            const solution = currentSolution.find(sol => sol.word === word);
            if (solution) {
                solution.positions.forEach(({ x, y }) => {
                    const cell = document.querySelector(`.cell[data-x='${x}'][data-y='${y}']`);
                    if (cell) {
                        cell.style.backgroundColor = 'yellow'; // Highlight found words
                    }
                });
            }
        });
    }
}
