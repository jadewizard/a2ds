/**
 * Created by jade on 02.12.15.
 */

window.onload = function() { gameInitialization(); } // functions for game initialization

function gameInitialization()
{
    // SYSTEM VARIABLE
    canvas = document.getElementById("game"); // game field
    canvas.width = 600; // game width
    canvas.height = 350; // game height
    canvasContext = canvas.getContext("2d"); // game context for draw
    shotCount = 0; // counter for shots

    // GAME GRAPHIC AND PHISICS
    graphicArray = new Object(); // assoc array for texture store
    graphicArray.player = "texturse/player";
    graphicArray.background = "texturse/space.png";
    graphicArray.playershot = "texturse/playershot.png";
    graphicArray.heavyEnemy = "texturse/heavyEnemy";

    // INSTANCES CLASSES FOR GAME TEXTURSE
    gameBg = new gameBackground(); // new instance gameBackground
    // PLAYER
    playerModel = new playerObject(); // new instance playerObject
    shot = new playerShotObject(); // shot object
    playerShotsArray = new Array(); // player all shots array
    // ENEMY
    enemyArray = new Array();
    enemy = new allEnemyObjects(); // new instance heavyEnemy
    enemy.firstCreate();

    setInterval(gameUpdate, 60); // game updater
}

function gameBackground()
{
    this.y1 = 0;
    this.y2 = -350;

    var firstBgImages = new Image();
    var secondBgImages = new Image();

    firstBgImages.src = graphicArray.background;
    secondBgImages.src = graphicArray.background;

    this.draw = function()
    {
        canvasContext.drawImage(firstBgImages, 0,  this.y1, canvas.width, canvas.height);
        canvasContext.drawImage(secondBgImages, 0,  this.y2, canvas.width, canvas.height);
    }

    this.backgroundAction = function()
    {
        this.y1 += 6;
        this.y2 += 6;

        if(this.y2 >= 350 || this.y1 >= 350)
        {
            this.y1 = 0;
            this.y2 = -350;
        }
    }
}

function playerObject()
{
    var iteration = 0; // game iteration
    this.x = 270; // player X
    this.y = 300; // player Y

    var playerImage = new Image();

    this.draw = function()
    {
        ++iteration; // inc game iteration
        playerImage.src = graphicArray.player + iteration + ".png";

        canvasContext.drawImage(playerImage, this.x, this.y);

        if(iteration >= 3) iteration = 0; // zeroes iteration
    }

    this.action = function()
    {
        document.onkeydown = function(event)
        {
            // console.log(event.keyCode);
            if(event.keyCode == 39) { playerModel.x += 50 } // to right->
            if(event.keyCode == 37) { playerModel.x -= 50 } // to left ->

            if(event.keyCode == 32) // press space
            {
                ++shotCount;
                shot.newShot(shotCount) // create new shot

                if(shotCount >= 7){ shotCount = 0 } // zeroes shot counter
            }

            if(this.x <= 0)
            {
                this.x = 568 // return in end
            }
            else if(this.x >= 600)
            {
                this.x = 0; // return in start
            }
        }
    }
}

function playerShotObject()
{
    this.x1 = playerModel.x + 3;
    this.y1 = playerModel.y - 10;
    this.x2 = playerModel.x + 23;
    this.y2 = playerModel.y - 10;

    var shotImage = new Image();
    shotImage.src = graphicArray.playershot;

    this.newShot = function(count)
    {
        playerShotsArray[count] = new playerShotObject();
        console.log(playerShotsArray);
    }

    this.draw = function()
    {
        canvasContext.drawImage(shotImage, playerShotsArray[i].x1, playerShotsArray[i].y1);
        canvasContext.drawImage(shotImage, playerShotsArray[i].x2, playerShotsArray[i].y2);
    }

    this.shotAction = function(i)
    {
        this.y1 -= 5;
        this.y2 -= 5;

        if(this.y1 <= 0 || this.y2 <= 0)
        {
            playerShotsArray[i] = undefined;
        }
    }
}

function heavyEnemyObject()
{
    var iteration = 0;
    this.x = rnd(50, 70); // enemy x
    this.y = rnd(-20, -50); // enemy y
    var heavyEnemyImage = new Image();

    this.draw = function(drawIteration)
    {
        ++iteration;
        heavyEnemyImage.src = graphicArray.heavyEnemy + iteration + ".png";
        canvasContext.drawImage(heavyEnemyImage, this.x + drawIteration * 100, this.y);

        if(iteration >= 4) iteration = 0; // zeroes iteration
    }

    this.enemyAction = function()
    {
        this.y += rnd(1, 3);
    }
}

function allEnemyObjects()
{
    this.firstCreate = function()
    {
        for(i = 0; i < rnd(3, 6); i++)
        {
            enemyArray[i] = new heavyEnemyObject();
        }
    }
}

function gameUpdate()
{
    gameBg.draw();
    playerModel.draw();
    playerModel.action();
    gameBg.backgroundAction();

    for(z = 0; z < enemyArray.length; z++)
    {
        enemyArray[z].draw(z);
        enemyArray[z].enemyAction();
    }

    for(i = 1; i < playerShotsArray.length; i++)
    {
        if(playerShotsArray[i] != undefined)
        {
            playerShotsArray[i].draw();
            playerShotsArray[i].shotAction(i);
        }
    }
}

function rnd(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
