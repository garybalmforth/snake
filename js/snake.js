const CANVAS_BORDER_COLOR = "black";
const CANVAS_BACKGROUND_COLOR = "white";
var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
const direction = {
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down"
};
//Initial direction
let headingDirection = direction.RIGHT;
//Event listener neccessary for key handlings
document.addEventListener("keydown", pressedKey);
var steppedHasFinished;
function pressedKey(event)
{
    var pressed = event.keyCode;
    if (steppedHasFinished)
    {
        if (pressed === 37 && (headingDirection !== direction.RIGHT))
        {
            headingDirection = direction.LEFT;
            //Both velocities must be defined
            velX = - unitVel;
            velY = 0;
            steppedHasFinished = false;
        }
        if (pressed === 38 && (headingDirection !== direction.DOWN))
        {
            headingDirection = direction.UP;
            velY = - unitVel;
            velX = 0;
            steppedHasFinished = false;
        }
        if (pressed === 39 && (headingDirection !== direction.LEFT))
        {
            headingDirection = direction.RIGHT;
            velX = unitVel;
            velY = 0;
            steppedHasFinished = false;
        }
        if (pressed === 40 && (headingDirection !== direction.UP))
        {
            headingDirection = direction.DOWN;
            velY = unitVel;
            velX = 0;
            steppedHasFinished = false;
        }
    }
}
let apples = [
    {x: 200, y: 10},
    {x: 210, y: 10},
    {x: 220, y: 10},
    {x: 230, y: 10}
];
function isInTheArray(value, array) {
    return array.indexOf(value) > -1;
}

function isInTheArray2D(value, array) {
    
    array.some(element => {
        if (element.x == value.x && element.y == value.y)
        {
            return true;
        }
    });
    return false;
}
function addingNewApples()
{
    let tempX = 0;
    let tempY = 0;
    let temporaryApple = {x: tempX, y: tempY};
   
    do {
        tempX = Math.floor(Math.random() * 390 / 10) * 10;
        tempY = Math.floor(Math.random() * 390 / 10) * 10;
        console.log("x: " + tempX + " y: " + tempY);
        temporaryApple = {x: tempX, y: tempY};
    } while (isInTheArray2D(temporaryApple, snake));
   
    apples.push(temporaryApple);
}
function drawingApples()
{
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    apples.forEach(function(item, index, array){
        ctx.beginPath();
        ctx.arc(item.x+unitVel/2, item.y+unitVel/2, unitVel/2, 0, 2*Math.PI, false);
        ctx.fill();
    });
}
let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
    {x: 100, y: 150},
    {x: 90, y: 150}
];
let unitVel = 10;
let velX = 10;
let velY = 0;
function checkTheApple(posX, posY)
{
    //findIndex is the proper method instead of indexOf
    let found = apples.findIndex(apple => apple.x === posX && apple.y === posY);
    
    if (found !== -1)
    {
        pauseLeaps += 3;
        
        apples.splice(found, 1);
        addingNewApples();
    }
}

function fatalMove(posX, posY)
{
    if (posX < 0 || posX >= 400 || posY < 0 || posY >= 400)
    {
        alert("You lost!");
        clearInterval(gameLoop);
    }
    if (snake.filter(element => element.x == posX && element.y == posY).length)
    {
        alert("You bite yourself!");
        clearInterval(gameLoop);
    }
}

let pauseLeaps = 0;
function moveTheSnake()
{
    let frontElement = {x:0, y:0};
    
    frontElement.x = snake[0].x + velX;
    frontElement.y = snake[0].y + velY;
    fatalMove(frontElement.x, frontElement.y);
    snake.unshift(frontElement);
    checkTheApple(frontElement.x, frontElement.y);
    //We should not let the pop execute for the next
    //couple of leaps, if an apple is eaten. <img draggable="false" class="emoji" alt="🙂" src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f642.svg">
    if (pauseLeaps == 0)
    {
        snake.pop();
    } else 
    {
        pauseLeaps -= 1;
    }
}
function drawTheSnake()
{
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "green";
    snake.forEach(function(item, index, array) {
        ctx.fillRect(item.x, item.y, 10, 10);
        ctx.strokeRect(item.x, item.y, 10, 10);
    });
}

function clearTheMap()
{
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.strokeStyle = CANVAS_BORDER_COLOR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
var gameLoop = setInterval(function() {
    clearTheMap();
    drawingApples();
    drawTheSnake();
    moveTheSnake();
    //We need this because if two arrow buttons 
    //pressed almost simultaniously
    //The computer will interpret it as the snake 
    //bite itself, which is not the case
    //We need to wait at least a full step, 
    //until we can take in another arrow key
    steppedHasFinished = true;
}, 100);