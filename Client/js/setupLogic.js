// Function to set the grid size and highlight the selected button
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

    playButtonSound('/audio/retro-coin-1.mp3');
}

// Function to create dynamic word input fields based on user input number and condition it
function createWordInputs() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const wordInputContainer = document.getElementById('wordInputContainer');
    wordInputContainer.innerHTML = ""; // Clear existing inputs 
    const gridSize = parseInt(document.getElementById('gridSize').value); // Fetch the grid size value

    playButtonSound('/audio/retro-coin-1.mp3');

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

// Function to validate inputs, save data to localStorage and proceed to the game if everything was correctly setup
function proceedToGame() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const wordInputContainer = document.getElementById('wordInputContainer');
    const wordInputs = wordInputContainer.querySelectorAll('.word-input');
    const words = [];
 
    // Condition each input field again (client won't be able to proceed if something is wrong)
    let allValid = true;
    wordInputs.forEach(input => {
        const value = input.value.trim();

        if (!/^[A-Za-z]+$/.test(value) || value.length > gridSize || value.length <= 1) { // If it isn't a letter, is bigger than the grid, or smaller than 2
            allValid = false;
            //input.reportValidity(); // Show the custom error message if present
        } else {
            words.push(value); // Add to the words list if valid
        }
    });

    if (allValid && wordCount > 0 && gridSize > 0 && words.length === wordCount) { //Actually validates
        localStorage.setItem('wordCount', wordCount);
        localStorage.setItem('gridSize', gridSize);
        localStorage.setItem('words', JSON.stringify(words));

        playButtonSound('/audio/retro-coin-1.mp3', '/game'); // Proceed to the game when everything looks good
    } else {
        alert('Please fill out all word fields correctly!');
    }
}

// Function to play a button sound (and navigate to a new URL if wanted)
function playButtonSound(soundPath, redirectUrl = null) {
    const soundEffect = new Audio(soundPath);
    soundEffect.play();

    // If a redirect URL is provided, navigate after the sound starts (this wasn't working correctly directly in the proceed function so this was the solution)
    if (redirectUrl) {
        soundEffect.onended = () => {
            window.location.href = redirectUrl;
        };
    }
}
