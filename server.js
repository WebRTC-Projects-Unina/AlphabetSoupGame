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
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    const solution = [];

    words.forEach(word => {
        const placedWord = placeWordInGrid(grid, word.toUpperCase(), gridSize);
        if (placedWord) {
            solution.push(placedWord); // Store the solution for each word
        }
    });

    // Fill remaining empty spaces
    fillEmptySpaces(grid);

    // Send the grid and solution back to the client
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
    const directions = [
        { x: 1, y: 0 }, // Horizontal
        { x: 0, y: 1 }, // Vertical
        { x: 1, y: 1 }  // Diagonal
    ];

    let placed = false;
    let tries = 0;
    const positions = []; // To store positions of this word

    while (!placed && tries < 50) {
        tries++;
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(grid, word, startX, startY, direction)) {
            for (let i = 0; i < word.length; i++) {
                const x = startX + i * direction.x;
                const y = startY + i * direction.y;

                grid[y][x] = word[i];
                positions.push({ x, y }); // Track positions for this word
            }
            placed = true;
        }
    }

    return placed ? { word, positions } : null; // Return solution map or null if placement failed
}


function canPlaceWord(grid, word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.x;
        const newY = y + i * direction.y;

        if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid.length) return false; // Word fits in the grid dimensions
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
