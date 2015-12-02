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

    // INSTANCES CLASSES FOR GAME TEXTURSE
    gameBg = new gameBackground(); // new instance gameBackground
    playerModel = new playerObject(); // new instance playerObject
    shot = new shotObject(); // shot object
    playerShotsArray = new Array(); // shots array

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

        if(iteration >= 4) iteration = 0; // zeroes iteration
    }

    this.userAction = function()
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

                console.log(shotCount);
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

function shotObject()
{
    this.x1 = playerModel.x + 3;
    this.y1 = playerModel.y - 10;
    this.x2 = playerModel.x + 23;
    this.y2 = playerModel.y - 10;

    var shotImage = new Image();
    shotImage.src = graphicArray.playershot;

    this.newShot = function(count)
    {
        playerShotsArray[count] = new shotObject();

        console.log(playerShotsArray);
    }

    this.draw = function()
    {
        canvasContext.drawImage(shotImage, playerShotsArray[i].x1, playerShotsArray[i].y1);
        canvasContext.drawImage(shotImage, playerShotsArray[i].x2, playerShotsArray[i].y2);
    }

    this.shotAction = function(i)
    {
        playerShotsArray[i].y1 -= 5;
        playerShotsArray[i].y2 -= 5;
    }
}

function gameUpdate()
{
    gameBg.draw();
    playerModel.draw();
    playerModel.userAction();
    gameBg.backgroundAction();

    for(i = 1; i < playerShotsArray.length; i++)
    {
        playerShotsArray[i].draw();
        playerShotsArray[i].shotAction(i);
    }
}