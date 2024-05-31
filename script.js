const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Add background text
const bgText = document.createElement('div');
bgText.id = 'backgroundText';
bgText.innerHTML = "NIJWM'S SNAKE GAME";
document.body.appendChild(bgText);

// Game variables
let box = 20;
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let d;
let eatSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Add a sound when snake eats

// Control the snake
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }
}

// Check collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw everything to the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Which direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // If the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play(); // Play sound when snake eats
        createExplosion(food.x, food.y); // Create explosion effect

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }
    } else {
        // Remove the tail
        snake.pop();
    }

    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Game over
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over! Your score: ' + score);
    }

    snake.unshift(newHead);

    // Score display
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

// Create explosion effect
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.style.position = 'absolute';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    explosion.style.width = '20px';
    explosion.style.height = '20px';
    explosion.style.backgroundColor = 'yellow';
    explosion.style.borderRadius = '50%';
    explosion.style.zIndex = 2;
    explosion.style.pointerEvents = 'none';
    document.body.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 300);
}

// Call draw function every 100 ms
let game = setInterval(draw, 100);
