var allEnemies, allLives;

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
  }

};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
  this.x = 200;
  this.y = 405;
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
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
