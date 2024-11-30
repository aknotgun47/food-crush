const rows = 7;
const columns = 5;
const candyColors = ["red", "green", "blue", "yellow", "orange"];
let gameBoard = document.getElementById('gameBoard');
let candies = [];
let selectedCandyIndex = -1;
let firstCandySelected = null;

function createBoard() {
    for (let i = 0; i < rows * columns; i++) {
        let candy = document.createElement('div');
        candy.classList.add('candy');
        let color = candyColors[Math.floor(Math.random() * candyColors.length)];
        candy.style.backgroundImage = `url(${color}.png)`;
        candy.style.backgroundSize = "cover";
        candy.dataset.color = color;
        candy.dataset.index = i;
        gameBoard.appendChild(candy);
        candies.push(candy);
    }
}

function highlightCandy(index) {
    candies[index].classList.add('selected');
}

function unhighlightCandy(index) {
    candies[index].classList.remove('selected');
}

function swapCandies(index1, index2) {
    let tempColor = candies[index1].dataset.color;
    candies[index1].style.backgroundImage = candies[index2].style.backgroundImage;
    candies[index1].dataset.color = candies[index2].dataset.color;
    candies[index2].style.backgroundImage = `url(${tempColor}.png)`;
    candies[index2].dataset.color = tempColor;
}

function checkMatches() {
    let matches = [];
    // Check horizontal matches
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns - 2; j++) {
            let index = i * columns + j;
            let color = candies[index].dataset.color;
            if (candies[index + 1].dataset.color === color && candies[index + 2].dataset.color === color) {
                matches.push(index, index + 1, index + 2);
            }
        }
    }
    // Check vertical matches
    for (let j = 0; j < columns; j++) {
        for (let i = 0; i < rows - 2; i++) {
            let index = i * columns + j;
            let color = candies[index].dataset.color;
            if (candies[index + columns].dataset.color === color && candies[index + 2 * columns].dataset.color === color) {
                matches.push(index, index + columns, index + 2 * columns);
            }
        }
    }
    return [...new Set(matches)]; // Remove duplicates
}

function removeMatches(matches) {
    matches.forEach(index => {
        let candy = candies[index];
        candy.style.backgroundImage = "";
        candy.dataset.color = "";
    });
}

function dropCandies() {
    for (let j = 0; j < columns; j++) {
        for (let i = rows - 1; i >= 0; i--) {
            let index = i * columns + j;
            if (candies[index].dataset.color === "") {
                for (let k = i - 1; k >= 0; k--) {
                    let aboveIndex = k * columns + j;
                    if (candies[aboveIndex].dataset.color !== "") {
                        candies[index].style.backgroundImage = candies[aboveIndex].style.backgroundImage;
                        candies[index].dataset.color = candies[aboveIndex].dataset.color;
                        candies[aboveIndex].style.backgroundImage = "";
                        candies[aboveIndex].dataset.color = "";
                        break;
                    }
                }
            }
        }
    }
}

function fillBoard() {
    for (let i = 0; i < candies.length; i++) {
        if (candies[i].dataset.color === "") {
            let color = candyColors[Math.floor(Math.random() * candyColors.length)];
            candies[i].style.backgroundImage = `url(${color}.png)`;
            candies[i].dataset.color = color;
        }
    }
}

function gameLoop() {
    let matches = checkMatches();
    if (matches.length > 0) {
        removeMatches(matches);
        dropCandies();
        fillBoard();
        setTimeout(gameLoop, 500); // Delay for visual effect
    }
}

function getAdjacentIndex(index, direction) {
    switch (direction) {
        case 'ArrowUp':
            return index >= columns ? index - columns : -1;
        case 'ArrowDown':
            return index < (rows - 1) * columns ? index + columns : -1;
        case 'ArrowLeft':
            return index % columns !== 0 ? index - 1 : -1;
        case 'ArrowRight':
            return index % columns !== columns - 1 ? index + 1 : -1;
        default:
            return -1;
    }
}

function handleKeyPress(event) {
    if (selectedCandyIndex === -1) {
        selectedCandyIndex = 0;
        highlightCandy(selectedCandyIndex);
    } else {
        let newSelectedIndex = selectedCandyIndex;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            newSelectedIndex = getAdjacentIndex(selectedCandyIndex, event.key);
            if (newSelectedIndex !== -1) {
                unhighlightCandy(selectedCandyIndex);
                highlightCandy(newSelectedIndex);
                selectedCandyIndex = newSelectedIndex;
            }
        } else if (event.key === 'Enter') {
            if (firstCandySelected === null) {
                firstCandySelected = selectedCandyIndex;
                highlightCandy(firstCandySelected);
            } else {
                if (Math.abs(firstCandySelected - selectedCandyIndex) === 1 || Math.abs(firstCandySelected - selectedCandyIndex) === columns) {
                    swapCandies(firstCandySelected, selectedCandyIndex);
                    if (checkMatches().length === 0) {
                        swapCandies(firstCandySelected, selectedCandyIndex); // Swap back if no matches
                    } else {
                        setTimeout(gameLoop, 500); // Start game loop after successful swap
                    }
                }
                unhighlightCandy(firstCandySelected);
                unhighlightCandy(selectedCandyIndex);
                firstCandySelected = null;
                selectedCandyIndex = -1;
            }
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

createBoard();
setTimeout(gameLoop, 500);
