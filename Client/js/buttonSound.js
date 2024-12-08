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
