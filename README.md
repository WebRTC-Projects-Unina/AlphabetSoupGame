# webrtc-project

To activate audio in the pages follow these steps in chrome:
1. Settings
2. Priavcy and Security
3. Site Settings
4. Additional content settings
5. Add 'http://localhost:8181'

To tackle:
- add a timer
- add to victory page the time that it took
- if word is wrong play wrong sound effect ((only if I have time))
- 


Errors:
- doesnt verify words
- 
- last thing: upper case letter input

Game Logic:

Steps to Verify the Word:
Highlight Cells: The user will highlight cells that form a word by clicking them. Each highlighted cell will be part of the selected word.
Extract the Selected Word: Once the user finishes their selection, you can extract the word from the highlighted cells.
Validate the Direction: Check if the selected cells form a straight line either horizontally, vertically, or diagonally.
Match with Grid: Compare the extracted word with the word placed in the grid at the correct starting position and direction.
