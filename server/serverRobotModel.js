/* serverRobotModel.js
 *
 * Robot data model with server-side logic
 *
 * Track positions are handled by tracking "distance" :
 *   0 : start
 *   1 : halfway lap1
 *   2 : start lap2
 *   etc - easy to set for multiple track shapes
 *
 *   TODO: add more segments to allow for position tracking
 */

var Vector3 = require('./Vector3.js');
var Running = require('./states/Running.js')
var Death = require('./states/Death.js')
var LinkedList = require('./LinkedList.js')
var Boosting = require('./states/Boosting.js');
var Waiting = require('./states/Waiting.js');
var settings = require('./robotModelSettings.js');


function Robot(game, delta,id,pos) {
  this.game = game;
  this.delta = delta;
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.4; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = settings.turnSpeed; // rotation per second (~6.28 is a 360 degrees per second)
  this.maxRunSpeed = settings.maxRunSpeed; //clamps the magnidue of speed vector
  this.maxBoostSpeed = settings.maxBoostSpeed;
  this.velocity = 0; 
  //this.facing = 0.25; 
  this.facing = 0;
  this.distance = -1; // waypoint count, not actual distance
  this.lastGridPosition = [0,0];
  this.energy = 100; 
  this.lastPosition = new LinkedList();
  this.maxEnergy = 100;
  this.isRunning = false; 
  this.isBoosting = false; 
  this.pressed = false;
  this.updateCounter = 0;
  this.finished = false;
  this.attackBox = [];
  this.position = pos; 
  this.setState('running'); //initial state
  //make mesh, set position
}

Robot.prototype.increaseEnergy = function(num) {
  if (this.energy < this.maxEnergy) {
    this.energy += num;
  }  
};

Robot.prototype.decreaseEnergy = function(num) {
  this.energy -= num;
  if(this.energy <= 0) {
    this.setState('death');
  }
};

Robot.prototype.hasWallCollision = function(map) {
  //wconsole.log('current server distance: ', this.distance);
  //compensate for the fact that 0,0 is the center of the 3d Babylon map,  
  //but is upper left of the 2d map
  //console.log('Babylon x: ', this.position.x);
  //console.log('Babylon z: ', this.position.z);
  //console.log(map);
  var xOnGrid = this.getXOnGrid(map);
  var yOnGrid = this.getYOnGrid(map);
  //console.log('xOnGrid: ', this.getXOnGrid(map));
  //console.log('yOnGridL ', this.getYOnGrid(map));

  //out of course bounds
  if (map.grid[yOnGrid] === undefined || map.grid[yOnGrid][xOnGrid] === undefined) {
    this.handleWallCollision();
    console.log('ERROR: out of course bounds');
  } else {
    //0 means a black pixel (wall) 

    return (map.grid[yOnGrid][xOnGrid] === 0 || map.grid[yOnGrid + 1][xOnGrid] === 0 || 
      map.grid[yOnGrid - 1][xOnGrid] === 0 || map.grid[yOnGrid][xOnGrid + 1] === 0 ||
      map.grid[yOnGrid][xOnGrid - 1] === 0 || map.grid[yOnGrid + 1][xOnGrid + 1] === 0 || 
      map.grid[yOnGrid + 1][xOnGrid - 1] === 0);
  }
};

Robot.prototype.handlePlayerCollision = function() {
  this.decreaseEnergy(this.velocity * settings.playerCollisionDamage);
  this.position.x = this.lastPosition.tail.value.x;
  this.position.z = this.lastPosition.tail.value.z;
};
Robot.prototype.stopMoving = function() {
  this.velocity = 0;
  this.stopRunning();
};

Robot.prototype.handleWallCollision = function() {

  this.decreaseEnergy(this.velocity * settings.wallCollisionDamage); //50% speed takes away 50 energy
  // //stop movement, stop running, move back to previous position


  this.stopMoving();
  this.position.x = this.lastPosition.tail.value.x;
  this.position.z = this.lastPosition.tail.value.z;

};

Robot.prototype.getXOnGrid = function(map) {
  return Math.round(this.position.x + map.width / 2);
};


Robot.prototype.getYOnGrid = function(map) {
  return Math.round(map.height / 2 - this.position.z);
};

Robot.prototype.update = function(input) {
  if(input['KE'] && !this.pressed) {
    this.decreaseEnergy(33);
    this.pressed = true;
    var self = this;
    setTimeout(function() {
      //Make 3 explosions
      for(var i = 1; i < 4; i++) {
        //Calulate 3 spots in fron of you
        var x = (1 + self.velocity) * self.forwardNormX * (i * 6) + self.position.x;
        var y = (1 + self.velocity) * self.forwardNormY * (i * 6) + self.position.z;
        self.attackBox.push({x: x,z: y});
        //Find players in that postition
        var array = self.game.playersInRadiusOfLocation({x:x,z:y}, 10);
        //Loop throught found players
        for(var aqw = 0; aqw < array.length; aqw++) {
          //Not yourself found
          if(self.id !== array[aqw].player.socketId) {
            //subtract there energy
            array[aqw].player.robotModel.decreaseEnergy(settings.attackDamage * (10 - array[aqw].distance))
          }
        }
        //Allow attacking after time
        setTimeout(function() {
          self.pressed = false;
        }, 200)
      }
      
    }, 200)
  }
  this.state.update(this,input); 
};

Robot.prototype.setState = function(name) {
  var state = Robot.states[name];
  if(this.state && this.state.exitState){
    this.state.exitState(this); 
  }
  this.state = state; 
  if(this.state.enterState){
    this.state.enterState(this);
  } 
};

Robot.prototype.startRunning = function(){
 // scene.beginAnimation(this.skeleton,16,32,true,1.0); 
  this.isRunning = true; 
};
Robot.prototype.stopRunning = function(){
//  scene.beginAnimation(this.skeleton,0,10,true,1.0); 
  this.isRunning = false;
};

Robot.prototype.startBoosting = function() {
  this.isBoosting = true;
};

Robot.prototype.stopBoosting = function() {
  this.isBoosting = false;
};

Robot.states = {
  running: new Running(),
  death: new Death(),
  boosting: new Boosting(),
  waiting: new Waiting()
};

module.exports = Robot;
