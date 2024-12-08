const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, 'client')));   // Better practice than app.use(express.static('client'))
app.use(express.json()); // To parse JSON requests

// Start the server
const PORT = 8181;
httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Default route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'welcome.html'));
});
// Route for the setup page
app.get('/setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'setup.html'));
});
// Route for the game page
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'game.html'));
});
// Route for the victory page
app.get('/victory', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'victory.html'));
});


// API endpoint for generating the puzzle
app.post('/generatePuzzle', (req, res) => {
    const { words, gridSize } = req.body;

    if (!words || !gridSize) {
        return res.status(400).json({ error: 'Words and grid size are required' });
    }  // If either the words or the gridsize are missing there's a message in the browser

    const { grid, solution } = generatePuzzle(words, gridSize);
    res.json({ grid, solution });
});

// Puzzle generation logic
function generatePuzzle(words, gridSize) {
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill('')); // Creates two-dimensional array of size gridSize x gridSize filled with ''
    const solution = []; // To store the solution grid for the solution button

    words.forEach(word => {
        if (placeWordInGrid(grid, word, gridSize)) {
            solution.push({ word, grid: JSON.parse(JSON.stringify(grid)) });
        }
    });

    fillEmptySpaces(grid);
    return { grid, solution };
}

function placeWordInGrid(grid, word, gridSize) {
    const directions = [  // x is column index and y is line 
        { x: 1, y: 0 },   // Horizontal
        { x: 0, y: 1 },   // Vertical
        { x: 1, y: 1 }    // Diagonal
    ];

    let placed = false;
    let tries = 0;

    while (!placed && tries < 50) {
        tries++;
        const direction = directions[Math.floor(Math.random() * directions.length)];  // Makes up a random number (0,1 or 2) and .floor rounds it to an integer
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize); // Choosing random direction, starting column and starting line

        if (canPlaceWord(grid, word, startX, startY, direction)) {
            for (let i = 0; i < word.length; i++) {
                grid[startY + i * direction.y][startX + i * direction.x] = word[i];
            }
            placed = true;
        }
    }

    return placed;
}

function canPlaceWord(grid, word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.x;
        const newY = y + i * direction.y;

        if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid.length) return false; // Word fits in the grid dimentions
        if (grid[newY][newX] !== '' && grid[newY][newX] !== word[i]) return false; // Word isn't being place on top of another unless its a common letter
    }
    return true;
}

function fillEmptySpaces(grid) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            if (!grid[y][x]) grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    }
}
