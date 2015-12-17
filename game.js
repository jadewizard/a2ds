/*
* TODO
* 0) Fixed stuck in FF
* 1) Add enemy fire
* 2) Add enemy & player clash handler
* */

window.onload = function() { gameInitialization(); } // functions for game initialization

function gameInitialization()
{
    // SYSTEM VARIABLE
    canvas = document.getElementById("game"); // game field
    canvas.width = 600; // game width
    canvas.height = 350; // game height
    canvasContext = canvas.getContext("2d"); // game context for draw
    shotCount = 0; // counter for shots
    playerKillCounter = 0;
    game = new game();

    // GAME GRAPHIC AND PHISICS
    graphicArray = new Object(); // assoc array for texture store
    graphicArray.player = "texturse/player";
    graphicArray.background = "texturse/space.png";
    graphicArray.playershot = "texturse/playershot.png";
    graphicArray.enemy = new Array();
    graphicArray.enemy[1] = "texturse/heavyEnemy";
    graphicArray.enemy[2] = "texturse/liteEnemy";

    // INSTANCES CLASSES FOR GAME TEXTURSE
    gameBg = new gameBackground(); // new instance gameBackground
    // PLAYER
    playerModel = new playerObject(); // new instance playerObject
    shot = new playerShotObject(); // shot object
    playerShotsArray = new Array(); // player all shots array
    score = new playerScore();
    // ENEMY
    enemyArray = new Array();
    enemy = new allEnemyObjects(); // new instance heavyEnemy
    enemy.firstCreate();

    setInterval(function(){
        requestAnimationFrame(gameUpdate);
    }, 60);

    game.event();
}

function game()
{
    this.levelOffset = 100;
    this.event = function()
    {

    }

    this.level = function()
    {
        if(playerKillCounter > 1) { this.levelOffset = 70; }
        if(playerKillCounter > 2) { this.levelOffset = 50; }
        if(playerKillCounter > 1000) { this.levelOffset = 30; }
    }
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
    this.currentGun = 0;
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
            if(event.keyCode == 39) { playerModel.x += 40 } // to right->
            if(event.keyCode == 37) { playerModel.x -= 40 } // to left ->

            //console.log("PLAYER === " + playerModel.x);

            if(event.keyCode == 32) // press space
            {
                ++shotCount;
                shot.newShot(shotCount) // create new shot

                if(shotCount >= 20){ shotCount = 0 } // MAX shots == 20
                ++playerModel.currentGun;

                if(playerModel.currentGun >= 10) {playerModel.currentGun = 0} // zeroes current gun counter
            }

            if(playerModel.x <= 0)
            {
                playerModel.x = 568 // return in end
            }
            else if(playerModel.x >= 600)
            {
                playerModel.x = 0; // return in start
            }
        }
    }
}

function playerShotObject()
{
    if(playerModel.currentGun % 2 == 0)
    {
        this.x = playerModel.x + 3;
        this.y = playerModel.y - 10;
    }
    else
    {
        this.x = playerModel.x + 23;
        this.y = playerModel.y - 10;
    }

    var shotImage = new Image();
    shotImage.src = graphicArray.playershot;

    this.newShot = function(count)
    {
        playerShotsArray[count] = new playerShotObject();
        //console.log(playerShotsArray);
    }

    this.draw = function()
    {
        canvasContext.drawImage(shotImage, playerShotsArray[i].x, playerShotsArray[i].y);
    }

    this.shotAction = function(i)
    {
        this.y -= 5;

        //console.log("SHOT === " + this.x1);

        if(this.y <= 0)
        {
            playerShotsArray[i] = undefined;
        }
    }
}

function heavyEnemyObject()
{
    var iteration = 0;
    var r = rnd(1, 2); // random game models

    if(enemy.firstValue == false) // first creation
    {
        this.x = 0; // enemy x
    }
    else // post.. create
    {
        this.x = rnd(-50, 100); // enemy x
    }
    this.y = rnd(-40, -120); // enemy y

    //this.killCount = 0; // counter for killed ships. Start with 10 as previous elements are used
    var enemyImage = new Image();

    this.draw = function(drawIteration)
    {
        if(this.x + drawIteration * game.levelOffset < 550)
        {
            ++iteration;
            enemyImage.src = graphicArray.enemy[r] + iteration + ".png";
            canvasContext.drawImage(enemyImage, (this.x + drawIteration * game.levelOffset) + 10, this.y);
            if(iteration >= 4) iteration = 0; // zeroes iteration
        }
    }

    this.enemyAction = function()
    {
        this.y += rnd(1, 3);
    }

    this.dead = function(enemyIteration)
    {
        for(i = 1; i < playerShotsArray.length; i++)
        {this.firstValue = true;
            if(playerShotsArray[i] != undefined)
            {
                if(enemyArray[enemyIteration] != undefined)
                {
                    if(playerShotsArray[i].x >= (enemyArray[enemyIteration].x + enemyIteration * game.levelOffset) + 10 &&
                        playerShotsArray[i].x <= (enemyArray[enemyIteration].x + enemyIteration * game.levelOffset + 32) + 10 &&
                        playerShotsArray[i].y <= enemyArray[enemyIteration].y && enemyArray[enemyIteration].y >= 10)
                    {
                        enemyArray[enemyIteration] = undefined;
                        playerShotsArray[i] = undefined;
                        //console.log("[SHOT] --- X === " + (playerShotsArray[i].x1));
                        //console.log("[SHOT] --- Y === " + playerShotsArray[i].y1);
                        //console.log("[ENEMY] --- X === " + enemyArray[enemyIteration].x);
                        //console.log("[ENEMY] --- Y === " + (enemyArray[enemyIteration].y + 32));

                        //console.log(enemyArray.length);
                        ++playerKillCounter; // player kill ships inc counter!

                        if(this.killCount >= 15) {this.killCount = 0} // zeroes counter
                    }
                }
                //console.log("ENEMY X = " + (enemyArray[1].x + 1 * 100 + 32));
                //console.log("SHOTS X = " + playerShotsArray[1].x1);
            }
        }

        if(enemyArray[enemyIteration] != undefined && enemyArray[enemyIteration].y > 350)
        {
            enemyArray[enemyIteration] = undefined;
        }
        enemy.reborn(); // reborn killed ships
    }
}

function playerScore()
{
    this.x = 1;
    this.y = 10;

    this.draw = function()
    {
        canvasContext.fillStyle = "#fff";
        canvasContext.fillText("SCORE: " + playerKillCounter, this.x, this.y);
    }
}

function allEnemyObjects()
{
    this.enemyIteration = 0;
    this.firstValue = false;

    this.firstCreate = function()
    {
        for(i = 1; i < rnd(3, 6) + 1; i++)
        {
            console.log(i);
            enemyArray[i] = new heavyEnemyObject();
        }
        this.firstValue = true;
        //console.log("ENEMY === " + (enemyArray[1].x * 2 + 32));
    }

    this.reborn = function()
    {
        for(var i = 1; i < 20; i++)
        {
            if(enemyArray[i] == undefined)
            {
                enemyArray[i] = new heavyEnemyObject(); // add new ships
                break;
            }
        }
    }

    this.addShips = function()
    {
        arraySize = enemyArray.length; // size enemy array
        enemyArray[arraySize + 1] = new heavyEnemyObject();
    }
}

function gameUpdate()
{
    gameBg.draw();
    playerModel.draw();
    playerModel.action();
    gameBg.backgroundAction();
    score.draw(); // draw player score
    game.level();

    for(i = 1; i < playerShotsArray.length; i++)
    {
        if(playerShotsArray[i] != undefined)
        {
            playerShotsArray[i].draw();
            playerShotsArray[i].shotAction(i);
        }
    }

    for(z = 1; z < enemyArray.length; z++)
    {
        if(enemyArray[z] != undefined)
        {
            enemyArray[z].draw(z);
            enemyArray[z].enemyAction();
            enemyArray[z].dead(z);
        }
    }

}

function rnd(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
