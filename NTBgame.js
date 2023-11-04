let player;
let balls = [];
let bananas = [];
let pb = 0;
let ballDropSpeed = 5;
let score = 0;
let lives = 1;
let startTime;
let bananaDispenseTimer;
let lastSpeedIncreaseTime;
let settingsOpen = false;
let currentDifficulty = 'Medium'; // Possible values: 'Easy', 'Medium', 'Hard'
let greenBalls = [];
let greenBallDispenseTimer;
let greenb = 0;
let greenBallHitTime = null;
let gb = 0;
let pinkBalls = [];
let pinkballDispenseTimer;
let pinkb = 0;
let pinkBallHitTime = null;
const GREEN_BALL_MESSAGE_DURATION = 2000;
const WIDTH = 580;
const HEIGHT = 400;
const PLAYER_SIZE = 20;
const BALL_SIZE = 15;
const BANANA_SIZE = 15;
const SPEED_INCREASE_INTERVAL = 5000;
const SPEED_INCREASE_AMOUNT = 0.5;
const BANANA_DISPENSE_INTERVAL = 10000;
const MAX_BANANAS = 2;

let gameState = "start"; // Possible states: "start", "playing", "gameOver"

function setup() {
createCanvas(WIDTH, HEIGHT);
player = new Player(WIDTH / 2, HEIGHT - PLAYER_SIZE * 2);
for (let i = 0; i < random(5, 15); i++) {
    balls.push(new Ball());
}
startTime = millis();
bananaDispenseTimer = millis();
lastSpeedIncreaseTime = millis();
}

class greenBall {
constructor() {
    this.reset();
}

move() {
    this.y += ballDropSpeed - pb - 1;
    if (this.y > HEIGHT) {
        this.reset();
    }
}

reset() {
    this.x = random(0, WIDTH - BALL_SIZE);
    this.y = random(-HEIGHT, -BALL_SIZE);
}

draw() {
    fill(0, 100, 0); // green
    circle(this.x + BALL_SIZE / 2, this.y + BALL_SIZE / 2, BALL_SIZE);
}
}

class pinkBall {
    constructor() {
        this.reset();
    }
    
    move() {
        this.y += ballDropSpeed - pb - 0.5;
        if (this.y > HEIGHT) {
            this.reset();
        }
    }
    
    reset() {
        this.x = random(0, WIDTH - BALL_SIZE);
        this.y = random(-HEIGHT, -BALL_SIZE);
    }
    
    draw() {
        fill(255, 192, 203); // pink
        circle(this.x + BALL_SIZE / 2, this.y + BALL_SIZE / 2, BALL_SIZE);
    }
    }


function draw() {
    if (settingsOpen) {
        drawSettingsScreen();
    } else if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        playGame();
    } else if (gameState === "paused") {
        drawPauseScreen();
    } else if (gameState === "gameOver") {
        gameOver();
    }

    // Draw the pause/resume button only when the game is in the playing or paused state
    if (["playing", "paused"].includes(gameState)) {
        drawPauseButton();
    }
}

function drawPauseButton() {
    fill(200);
    noStroke();
    rect(450, 10, 430, 40); // x, y, width, height of the pause button
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(gameState === "playing" ? "Pause" : "Resume", 500, 30); // x, y position of the text
}

function drawPauseScreen() {
    // You can draw a semi-transparent rectangle over the screen to darken the game when paused
    fill(0, 0, 0, 127); // RGBA color with alpha for transparency
    rect(0, 0, WIDTH, HEIGHT); // Cover the whole canvas
    // You can also display a paused message or instructions here
}

function drawStartScreen() {
background(255);
fill(0);
textSize(48);
textAlign(CENTER, CENTER);
text("Elle", WIDTH / 2, HEIGHT / 2 - 60);

// Click to Start button
textSize(32);
let startText = "Click to Start";
let startTextWidth = textWidth(startText);
let startButtonX = WIDTH / 2 - startTextWidth / 2 - 10; // Centering the button
let startButtonY = HEIGHT / 2 + 20;
let startButtonWidth = startTextWidth + 20;
let startButtonHeight = 40;
fill(100);
rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
fill(255);
text(startText, WIDTH / 2, startButtonY + startButtonHeight / 2);

// Settings button
textSize(20);
let settingsText = "Settings";
let settingsTextWidth = textWidth(settingsText);
let settingsButtonX = WIDTH / 2 - settingsTextWidth / 2 - 10;
let settingsButtonY = HEIGHT / 2 + 80;
let settingsButtonWidth = settingsTextWidth + 20;
let settingsButtonHeight = 40;
fill(100);
rect(settingsButtonX, settingsButtonY, settingsButtonWidth, settingsButtonHeight);
fill(255);
text(settingsText, WIDTH / 2, settingsButtonY + settingsButtonHeight / 2);

greenBallDispenseTimer = millis();
pinkBallDispenseTimer = millis() + 50;
}


function drawSettingsScreen() {
background(220);
fill(0);
textSize(32);
text("Settings", WIDTH / 2, HEIGHT / 4);

// Easy button
fill(currentDifficulty === 'Easy' ? [0, 0, 255] : [100]); // Blue if selected
rect(WIDTH / 2 - 100, HEIGHT / 2 - 60, 200, 40);
fill(255);
textSize(20);
text("Easy", WIDTH / 2, HEIGHT / 2 - 35);

// Medium button
fill(currentDifficulty === 'Medium' ? [0, 0, 255] : [100]); // Blue if selected
rect(WIDTH / 2 - 100, HEIGHT / 2, 200, 40);
fill(255);
textSize(20);
text("Medium", WIDTH / 2, HEIGHT / 2 + 25);

// Hard button
fill(currentDifficulty === 'Hard' ? [0, 0, 255] : [100]); // Blue if selected
rect(WIDTH / 2 - 100, HEIGHT / 2 + 60, 200, 40);
fill(255);
textSize(20);
text("Hard", WIDTH / 2, HEIGHT / 2 + 85);

    // Back button
    fill(100);
    rect(WIDTH / 2 - 60, HEIGHT / 2 + 140, 120, 40);
    fill(255);
    text("Back", WIDTH / 2, HEIGHT / 2 + 165);
}

greenBalls.forEach((greenBall, index) => {
    greenBall.move();
    greenBall.draw();

    if (checkCollision(player, greenBall, BALL_SIZE)) {
        greenBalls.splice(index, 1);
        greenb += 150;
        gb += 1;
        greenBallHitTime = millis();
    }
});

function playGame() {
background(255);
player.move();
player.draw();

if (lives <= 2 && bananas.length < MAX_BANANAS && millis() - bananaDispenseTimer >= BANANA_DISPENSE_INTERVAL) {
    bananas.push(new Banana());
    bananaDispenseTimer = millis();
}

if (greenBallHitTime && millis() - greenBallHitTime < GREEN_BALL_MESSAGE_DURATION) {
    displayGreenBallHitMessage();
}

if (millis() - greenBallDispenseTimer >= 10000) {
    greenBalls.push(new greenBall());
    greenBallDispenseTimer = millis();
}

if (millis() - pinkBallDispenseTimer >= 10000) {
    pinkBalls.push(new pinkBall());
    pinkBallDispenseTimer = millis() + 50;
}



greenBalls.forEach((greenBall, index) => {
    greenBall.move();
    greenBall.draw();

    if (checkCollision(player, greenBall, BALL_SIZE)) {
        greenBalls.splice(index, 1);
        greenb += 150;  // Increase the greenb score
        gb += 1;
    }
});

pinkBalls.forEach((pinkBall, index) => {
    pinkBall.move();
    pinkBall.draw();

    if (checkCollision(player, pinkBall, BALL_SIZE)) {
        pinkBalls.splice(index, 1);
        pb += 0.5;
    }
});


fill(0);
textSize(24);
textAlign(RIGHT, TOP);
text(`${currentDifficulty}`, 320, 10);

bananas.forEach((banana, index) => {
    banana.move();
    banana.draw();
    if (checkCollision(player, banana, BANANA_SIZE)) {
    bananas.splice(index, 1);
    lives++;
    }
});

balls.forEach(ball => {
    ball.move();
    ball.draw();
    if (checkCollision(player, ball, BALL_SIZE)) {
    ball.reset();
    lives--;
    if (lives === 0) {
        gameState = "gameOver";
    }
    }
});

if (millis() - lastSpeedIncreaseTime >= SPEED_INCREASE_INTERVAL) {
    ballDropSpeed += SPEED_INCREASE_AMOUNT;
    lastSpeedIncreaseTime = millis();
}

if ((millis() - startTime) / 100 <= 500) {
    score = ((millis() - startTime) / 100) + greenb;
} else {
    score = (((millis() - startTime) / 80) - 125) + greenb;
}

displayScoreAndLives(score, lives);
}

function gameOver() {
noLoop();
background(255); // Clear screen
fill(0);
textSize(64);
textAlign(CENTER, CENTER);
text("Game Over", WIDTH / 2, HEIGHT / 2 - 60);
textSize(32);
greenb = 0;
gb = 0;
pb = 0
text(`Score: ${Math.floor(score)}`, WIDTH / 2, HEIGHT / 2);

// Draw restart button
fill(100);
rect(WIDTH / 2 - 60, HEIGHT / 2 + 30, 120, 40);
fill(255);
textSize(20); // Smaller font size for the button text
text("Restart", WIDTH / 2, HEIGHT / 2 + 50); // Adjust Y position for text
}

function displayGreenBallHitMessage() {
    textSize(24);
    fill(0, 255, 0); // Green color for the message
    textAlign(CENTER, TOP);
    text("+150", WIDTH / 2, 20);
}

function mouseClicked() {
if (settingsOpen) {
    if (gameState === "playing") { // makes it such that if you press on one half of the screen it
        // Click on the left side of the screen
        if (mouseX < WIDTH / 2) {
            player.moveLeft();
        }
        // Click on the right side of the screen
        else if (mouseX >= WIDTH / 2) {
            player.moveRight();
        }
    }
    // Easy button click
    if (mouseX > WIDTH / 2 - 100 && mouseX < WIDTH / 2 + 100 && mouseY > HEIGHT / 2 - 60 && mouseY < HEIGHT / 2 - 20) {
        currentDifficulty = 'Easy';
        SPEED_INCREASE_INTERVAL = 20000;
    }
    // Medium button click
    else if (mouseX > WIDTH / 2 - 100 && mouseX < WIDTH / 2 + 100 && mouseY > HEIGHT / 2 && mouseY < HEIGHT / 2 + 40) {
        currentDifficulty = 'Medium';
        SPEED_INCREASE_INTERVAL = 10000;
        ballDropSpeed = 6 - pb;
    }
    // Hard button click
    else if (mouseX > WIDTH / 2 - 100 && mouseX < WIDTH / 2 + 100 && mouseY > HEIGHT / 2 + 60 && mouseY < HEIGHT / 2 + 100) {
        currentDifficulty = 'Hard';
        SPEED_INCREASE_INTERVAL = 5000;
        ballDropSpeed = 8 - pb;
    }
    // Back button click
    if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 140 && mouseY < HEIGHT / 2 + 180) {
        settingsOpen = false;
    }
} else if (gameState === "start") {
    // Start game button
    if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 20 && mouseY < HEIGHT / 2 + 60) {
        gameState = "playing";
        resetGame();
    }
    // Open settings button
    else if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 80 && mouseY < HEIGHT / 2 + 120) {
        settingsOpen = true;
        if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 140 && mouseY < HEIGHT / 2 + 180) {
            settingsOpen = false;
        }
    }
    
} else if (gameState === "gameOver") {
    // Restart button
    if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 30 && mouseY < HEIGHT / 2 + 70) {
        resetGame();
    }
    // Settings button
    else if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 80 && mouseY < HEIGHT / 2 + 120) {
        settingsOpen = true;
        if (mouseX > WIDTH / 2 - 60 && mouseX < WIDTH / 2 + 60 && mouseY > HEIGHT / 2 + 140 && mouseY < HEIGHT / 2 + 180) {
            settingsOpen = false;
        }
    }
}

if (mouseX > 450 && mouseX < 550 && mouseY > 10 && mouseY < 50) {
    if (gameState === "playing") {
        noLoop(); // Stop the draw loop
        gameState = "paused";
    } else if (gameState === "paused") {
        loop(); // Resume the draw loop
        gameState = "playing";
    }
}


if (mouseX > 0 && mouseX < 290 && mouseY < 200) {
    this.x -= this.speed;
}

if (mouseX > 290 && mouseX < 580 && mouseY < 200) {
    this.x += this.speed;
}

}


function resetGame() {
    balls = [];
    bananas = [];
    greenBalls = [];
    pinkBalls = [];
    
    // Reset player position but keep the speed
    player.x = WIDTH / 2;
    player.y = HEIGHT - PLAYER_SIZE * 2;
    
    for (let i = 0; i < random(5, 15); i++) {
        balls.push(new Ball());
    }
    
    lives = 1;
    score = 0;
    ballDropSpeed = 5 - pb;
    startTime = millis();
    bananaDispenseTimer = millis();
    lastSpeedIncreaseTime = millis();
    gameState = "playing";
    loop();
}

class Player {
constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
}

move() {
    if ((keyIsDown(LEFT_ARROW) || mouseClicked(mouseX > 0 && mouseX < 290 && mouseY < 200))&& this.x > 0) {
    this.x -= this.speed;
    }
    if ((keyIsDown(RIGHT_ARROW)|| mouseClicked(mouseX > 290 && mouseX < 580 && mouseY < 200)) && this.x < WIDTH - PLAYER_SIZE) {
    this.x += this.speed;
    }


}

draw() {
    fill(255, 0, 0); // green
    rect(this.x, this.y, PLAYER_SIZE, PLAYER_SIZE);
}
}

class Ball {
constructor() {
    this.reset();
}

move() {
    this.y += ballDropSpeed - pb;
    if (this.y > HEIGHT) {
    this.reset();
    }
}

reset() {
    this.x = random(0, WIDTH - BALL_SIZE);
    this.y = random(-HEIGHT, -BALL_SIZE);
}

draw() {
    fill(0, 0, 255); // Blue
    circle(this.x + BALL_SIZE / 2, this.y + BALL_SIZE / 2, BALL_SIZE);
}
}

class Banana {
constructor() {
    this.reset();
}

move() {
    this.y += ballDropSpeed - pb - 1.5;
    if (this.y > HEIGHT) {
    this.reset();
    }
}

reset() {
    this.x = random(0, WIDTH - BANANA_SIZE);
    this.y = random(-HEIGHT, -BANANA_SIZE);
}

draw() {
    fill(255, 255, 0); // Yellow
    circle(this.x + BANANA_SIZE / 2, this.y + BANANA_SIZE / 2, BANANA_SIZE);
}
}

function displayScoreAndLives(score, lives) {
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Score: ${Math.floor(score)}`, 10, 10);
    text(`Lives: ${lives}`, 10, 30);

    // Display greenb score if it's greater than 0
    if (greenb > 0) {
        textSize(20);
        fill(0, 100, 0); // Green color for greenb score
        
        text("+" + (gb*150), 420, 10); 
    }
}

function checkCollision(player, object, objectSize) {
return player.x < object.x + objectSize &&
        player.x + PLAYER_SIZE > object.x &&
        player.y < object.y + objectSize &&
        player.y + PLAYER_SIZE > object.y;
}
