//global variables
var allEnemies, allLives, currScore=0, highestScore=0, charNum=-1;

// Enemies class - player must avoid these
/* Enemy methods:
*  Update - updates the enemy position. Takes in one parameter(dt) a time delta between ticks
*  Render - draws the enemy on the screen
*/
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

Enemy.prototype.update = function(dt) {
    // movement multipled by dt to ensure the game runs at the same speed on all computers
    this.x += Math.round(this.speed * dt);

    if (this.x >= 500) {
      allEnemies.push(new Enemy(-60, this.y, Math.round(Math.random() * (60-20) + 20) * Math.round(Math.random() * (6-2) + 2 )));
      allEnemies.splice(allEnemies.indexOf(this),1);
    }

};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Player class
/* Player methods:
*  Update - prevents the player from exiting the game board
*  handleInput - moves the player, also allows reset and character change funcs to be called
*  render - draws the player on the screen
*  reset - returns the player to the starting position
*  character - changes the player character
*/
var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 405;
};

Player.prototype.update = function(dt) {
  if(this.x <= -20) {
    this.x = -10;
  }

  if(this.x >= 410) {
    this.x = 410;
  }

  if(this.y >= 405) {
    this.y = 405;
  }

  if(this.y <= -10) {
    this.y = -10;

    setTimeout( () => this.reset(), 300);          //visually show that the player has reached the water
    setTimeout( () => scores.updateScore(), 299);
  }
};

Player.prototype.handleInput = function(key) {
  switch(key){
    case "up":
      this.y -= 85;
      break;
    case "down":
      this.y += 85;
      break;
    case "left":
      this.x -= 105;
      break;
    case "right":
      this.x += 105;
      break;
    case "space":
      Newgame();
      break;
    case "c":
      player.character();
  }

};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
  this.x = 200;
  this.y = 405;
};

Player.prototype.character = function() {
  var chars = ['images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png', 'images/char-boy.png'];

  if(charNum != 4) {
    charNum++;
  } else {
    charNum = 0;
  }

  this.sprite = chars[charNum];
};

// lives class
/* Lives methods:
/* render - draws a life on the screen
*/
var Life = function(x) {
  this.sprite = 'images/small-heart.png';
  this.x = x;
  this.y = -15;
};

Life.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Scores class
/* Scores methods:
*  render - writes the score on the screen
*  updateScore - updates the score and increases game difficulty.
*/
var Scores = function() {
  this.scoreText = 'Score: ';
  this.highScoreText = 'High Score: ';
};

Scores.prototype.render = function() {
  ctx.font = '22px chalkboard, helvetica';
  ctx.fillStyle = 'black';
	ctx.fillText(this.scoreText + currScore, 240, 35);
  ctx.fillText(this.highScoreText + highestScore, 355, 35);
};

Scores.prototype.updateScore = function() {
  if(player.y == -10) {
    currScore++;
    star.collected = false;
    star.update();

    //increase difficulty by spawning an additional enemy if allEnemies less than 15
    if(allEnemies.length <= 15) {
      var enemyYs = [50, 135, 220];
      var eSpeed = Math.round(Math.random() * (60-20) + 20) * Math.round(Math.random() * (6-2) + 2 );
      allEnemies.push(new Enemy(0, enemyYs[Math.floor(Math.random() * (3 - 0)) + 0], eSpeed));
    }
  }
};

//Stars class
/* Adds the ability to earn extra points by collecting stars
*  Stars methods:
*  render - draws a star on the screen
*  update - randomly determines the position of the star
*/
var Stars = function(x, y) {
  this.sprite = 'images/Star.png';
  this.x = x;
  this.y = y;
  this.collected = false;
};

Stars.prototype.render = function() {
  if(this.collected == false) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

Stars.prototype.update = function() {
  var starX = [0, 100, 200, 300, 400];
  var starY = [240, 155, 70];

  this.x = starX[Math.floor(Math.random() * (5 - 0)) + 0];
  this.y = starY[Math.floor(Math.random() * (3 - 0)) + 0];
};

// Instantiate objects.
//starting state stored in newGame so the game can be reset easily
var Newgame = function() {
  allEnemies = [];
  for(var i = 0, yVal = 50; i < 3; i++, yVal+=85) {
    var enemyX = 0;
    var enemyY = yVal;
    var eSpeed = Math.round(Math.random() * (60-20) + 20) * Math.round(Math.random() * (6-2) + 2 );
    allEnemies.push(new Enemy(enemyX, enemyY, eSpeed));
  }

  player = new Player();

  allLives = [];
  for(var j = 0, xVal=0; j < 5; j++, xVal+=35) {
    allLives.push(new Life(xVal));
  }

  scores = new Scores();
  currScore = 0;

  star = new Stars(200, 155);
};


// This listens for key presses and sends the keys to the
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
