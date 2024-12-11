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

// Attach the function globally so it can be used in HTML files
window.playButtonSound = playButtonSound;

// Add event listeners to all buttons on the page
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button'); // Select all button elements
    const buttonSoundPath = '/audio/retro-coin-1.mp3'; // Path to button sound

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            playButtonSound(buttonSoundPath);
        });
    });
});

