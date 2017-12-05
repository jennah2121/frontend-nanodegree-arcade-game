var allEnemies, allLives, currScore=0, highestScore=0, charNum=-1;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += Math.round(this.speed * dt);

    if (this.x >= 500) {
      allEnemies.push(new Enemy(-60, this.y, Math.round(Math.random() * (60-20) + 20) * Math.round(Math.random() * (6-2) + 2 )));
      allEnemies.splice(allEnemies.indexOf(this),1);
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 405;
};

Player.prototype.update = function(dt) {
  //prevent player from exiting game board
  if(this.x <= -20) {
    this.x = -20;
  }

  if(this.x >= 410) {
    this.x = 410;
  }

  if(this.y >= 405) {
    this.y = 405;
  }

  if(this.y <= -10) {
    this.y = -10;
    //visually show that the player has reached the water
    setTimeout( () => this.reset(), 300);
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

//lives class
var Life = function(x) {
  this.sprite = 'images/small-heart.png';
  this.x = x;
  this.y = -15;
};

Life.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//score tracking
var Scores = function() {
  this.scoreText = 'Score: ';
  this.highScoreText = 'High Score: ';
};

Scores.prototype.render = function() {
  ctx.font = '22px chalkboard, helvetica';
  ctx.fillStyle = 'black';
	ctx.fillText(this.scoreText + currScore, 240, 35);
  ctx.fillText(this.highScoreText + highestScore, 360, 35);
};

Scores.prototype.updateScore = function() {
  if(player.y == -10) {
    currScore++;
    star.collected = false;
    star.update();

    //also increase difficulty by spawning an additional enemy if allEnemies less than 15
    if(allEnemies.length <= 15) {
      var enemyYs = [50, 135, 220];
      var eSpeed = Math.round(Math.random() * (60-20) + 20) * Math.round(Math.random() * (6-2) + 2 );
      allEnemies.push(new Enemy(0, enemyYs[Math.floor(Math.random() * (3 - 0)) + 0], eSpeed));
    }
  }
};

//add ability to collect extra points
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

  //randomly select an x and y for the star location
  this.x = starX[Math.floor(Math.random() * (5 - 0)) + 0];
  this.y = starY[Math.floor(Math.random() * (3 - 0)) + 0];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
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


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
