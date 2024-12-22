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


// POST for sending generated game grid over to CLIENT
app.post('/generatePuzzle', (req, res) => {  // Using POST because the request includes data in the request body
    const { words, gridSize } = req.body;
    const { grid, solution } = generatePuzzle(words, gridSize);
    
    res.json({ grid, solution }); // Sends the game grid and solution back to the front-end
});


// Function for final grid generating
function generatePuzzle(words, gridSize) {
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill('')); // Creates 2D array of size gridSize x gridSize filled with '' (empty strings)
    const solution = []; // To store the solution grid for the solution button

    words.forEach(word => {
        const placedWord = placeWordInGrid(grid, word.toUpperCase(), gridSize); // Places each word of the array words in the grid with all letters uppercase
        if (placedWord) {
            solution.push(placedWord); // Stores the solution for each word, looking like { word, positions } 
        }
    });

    fillEmptySpaces(grid);

    return { grid, solution };
}

// Function for placing words and saving their positions in an array
function placeWordInGrid(grid, word, gridSize) {
    const directions = [
        { x: 1, y: 0 }, // Horizontal
        { x: 0, y: 1 }, // Vertical
        { x: 1, y: 1 }  // Diagonal
    ];

    let placed = false;
    let tries = 0;
    const positions = []; // To store positions (x, y) of each letter of the current word

    while (!placed && tries < 50) {  // Tries to place it 50 times if couldn't be placed before
        tries++;
        const direction = directions[Math.floor(Math.random() * directions.length)];  // Picks a random direction from the array directions
        const startX = Math.floor(Math.random() * gridSize);  // Picks a random column to place the first letter of the word
        const startY = Math.floor(Math.random() * gridSize);  // Picks a random row to place the first letter of the word

        if (canPlaceWord(grid, word, startX, startY, direction)) {  // If the word is place-able, starts the process of placing the word in the grid
            for (let i = 0; i < word.length; i++) {
                const x = startX + i * direction.x;
                const y = startY + i * direction.y;

                grid[y][x] = word[i]; // Actually places the letter of index i in it's supposed grid place grid[y][x]
                positions.push({ x, y }); // Track positions for this word, keeping the coordinates of each letter (x, y)
            }
            placed = true; // Checks word out of word list as placed
        }
    }

    return placed ? { word, positions } : null; // Returns solution map if word is placed or null if couldn't be placed (in those 50 tries)
}

// Function for making sure it is possible to place word in certain position
function canPlaceWord(grid, word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.x;
        const newY = y + i * direction.y;

        if (newX < 0 || newX >= grid.length || newY < 0 || newY >= grid.length) return false; // Word fits in the grid dimensions
        if (grid[newY][newX] !== '' && grid[newY][newX] !== word[i]) return false; // Word isn't being place on top of another unless its a common letter
    }
    return true;
}

// Function for filling empty spaces with random alphabet letters
function fillEmptySpaces(grid) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            if (!grid[y][x]) grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)]; // If the cell is empty, picks a random index of the array alphabet
        }
    }
}
