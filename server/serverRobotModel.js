var Vector3 = require('./Vector3.js');
var Running = require('./states/Running.js')
var Death = require('./states/Death.js')
var LinkedList = require('./LinkedList.js')
var Boosting = require('./states/Boosting.js');
var settings = require('./robotModelSettings.js');


function Robot(delta,id,pos) {
  this.delta = delta;
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.4; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = settings.turnSpeed; // rotation per second (~6.28 is a 360 degrees per second)
  this.maxRunSpeed = settings.maxRunSpeed; //clamps the magnidue of speed vector
  this.maxBoostSpeed = settings.maxBoostSpeed;
  this.velocity = 0; 
  this.facing = 0; 
  this.lastGridPosition = [0,0];
  this.energy = 100; 
  this.lastPosition = new LinkedList();
  this.maxEnergy = 100;
  this.isRunning = false; 
  this.isBoosting = false; 

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

  //compensate for the fact that 0,0 is the center of the 3d Babylon map,  
  //but is upper left of the 2d map
  // console.log('Babylon x: ', this.position.x);
  // console.log('Babylon z: ', this.position.z);
  //console.log(map);
  var xOnGrid = this.getXOnGrid(map);
  var yOnGrid = this.getYOnGrid(map);
  //console.log(xOnGrid);
  //console.log(yOnGrid);

  //out of course bounds
  if (map.grid[yOnGrid] === undefined || map.grid[yOnGrid][xOnGrid] === undefined) {
    this.handleWallCollision();
    console.log('ERROR: out of course bounds');
  } else {
    //0 means a black pixel (wall) 
    return map.grid[yOnGrid][xOnGrid] === 0;
  }
};

Robot.prototype.handlePlayerCollision = function() {
  this.decreaseEnergy(this.velocity * settings.playerCollisionDamage);
  this.position.x = this.lastPosition.tail.value.x;
  this.position.z = this.lastPosition.tail.value.z;
};

Robot.prototype.handleWallCollision = function() {

  this.decreaseEnergy(this.velocity * settings.wallCollisionDamage); //50% speed takes away 50 energy
  //stop movement, stop running, move back to previous position

   this.velocity = 0;
   this.stopRunning();

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

  //console.log(this.energy);
  //console.log(this.state);
  //if spacebar is pressed
  if (input['K ']) {
    this.startBoosting();
    this.setState('boosting');
  } else {
    this.stopBoosting();
    this.setState('running');
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
  boosting: new Boosting()
};

module.exports = Robot;