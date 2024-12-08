function createWordInputs() {
    const wordCount = parseInt(document.getElementById('wordCount').value);
    const wordInputContainer = document.getElementById('wordInputContainer');
    wordInputContainer.innerHTML = ""; // Clear existing inputs

    if (wordCount > 0 && wordCount <= 5) {
        for (let i = 1; i <= wordCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Word ${i}`;
            input.className = 'word-input';
            input.required = true; // Ensure this field is validated
            input.id = `word${i}`;
            wordInputContainer.appendChild(input);
        }
    }
}

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
        window.location.href = '/game';
    } else {
        alert('Please fill out all word fields!');
    }
}
