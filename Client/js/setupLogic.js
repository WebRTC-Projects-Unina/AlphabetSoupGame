// Function to create dynamic word input fields based on user input number
function createWordInputs() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const wordInputContainer = document.getElementById('wordInputContainer');
    wordInputContainer.innerHTML = ""; // Clear existing inputs

    if (wordCount > 5) {
        alert("The maximum number of words is 5.");
    }

    if (wordCount > 0 && wordCount <= 5) {
        for (let i = 1; i <= wordCount; i++) {
            const input = document.createElement('input');
            input.type = 'text'; // Creates a text input field
            input.placeholder = `word ${i}`; // Adds a placeholder (word x)
            input.className = 'word-input'; // Styling in the css file
            input.required = true; // Ensures the input cannot be left empty
            input.id = `word${i}`; // Sets ID for each input word

            // Event listener for conditioning word input
            input.addEventListener('input', () => {
                const value = input.value.trim();

                if (!/^[A-Za-z]+$/.test(value)) {
                    input.setCustomValidity("Only letters are allowed!");
                } else if (value.length > gridSize || value.length <=1) {
                    input.setCustomValidity(`Word must have characters between 2 and ${gridSize}!`);
                } else {
                    input.setCustomValidity(""); // Is a valid input (doesn't show any message)
                }

                input.reportValidity(); // Sends the .setCustomValidity messages
            });

            wordInputContainer.appendChild(input); // 
        }
    }
}

// Function to set the grid size and visually highlight the selected button
function setGridSize(size) {
    const gridSizeInput = document.getElementById('gridSize');
    gridSizeInput.value = size;

    // Highlight the selected button
    const buttons = document.querySelectorAll('#gridSizeOptions button');
    buttons.forEach(button => {
        button.style.backgroundColor = ''; // Reset button style
        button.style.color = '#00ff00';   // Reset text color
    });

    const clickedButton = event.target;
    clickedButton.style.backgroundColor = '#00ff00'; // Highlight background
    clickedButton.style.color = 'black';           // Invert text color
}

// Function to proceed to the game, validating inputs and saving data to localStorage
function proceedToGame() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const wordInputContainer = document.getElementById('wordInputContainer');
    const wordInputs = wordInputContainer.querySelectorAll('.word-input');
    const words = [];

    // Validate inputs
    let allFilled = true;
    wordInputs.forEach(input => {
        if (input.value.trim() === "") {
            allFilled = false;
        } else {
            words.push(input.value.trim());
        }
    });

    if (allFilled && wordCount > 0 && gridSize > 0) {
        // Save data in localStorage
        localStorage.setItem('wordCount', wordCount);
        localStorage.setItem('gridSize', gridSize);
        localStorage.setItem('words', JSON.stringify(words));

        // Proceed to the game
        playButtonSound('/audio/retro-coin-1.mp3', '/game');
    } else {
        alert('Please fill out all word fields correctly!');
    }
}

// Function to play a button sound and optionally navigate to a new URL
function playButtonSound(soundPath, redirectUrl = null) {
    const soundEffect = new Audio(soundPath);
    soundEffect.play();

    // If a redirect URL is provided, navigate after the sound starts
    if (redirectUrl) {
        soundEffect.onended = () => {
            window.location.href = redirectUrl;
        };
    }
}

// Add sound effects to buttons and inputs on the page
document.addEventListener('DOMContentLoaded', () => {
    const buttonSoundPath = '/audio/retro-coin-1.mp3'; // Path to button sound

    // Select all buttons and attach the sound effect
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            playButtonSound(buttonSoundPath);
        });
    });

    // Attach the sound effect to the number input arrows
    const wordCountInput = document.getElementById('wordCount');
    if (wordCountInput) {
        wordCountInput.addEventListener('change', () => {
            playButtonSound(buttonSoundPath);
        });
    }
});
