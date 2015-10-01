var Vector3 = require('./Vector3.js');
var Running = require('./states/Running.js')
var Death = require('./states/Death.js')

function Robot(delta,id,pos) {
  this.delta = delta;
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.4; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = .5; // rotation per second (~6.28 is a 360 degrees per second)
  this.maxSpeed = 1; //clamps the magnidue of speed vector
  this.velocity = 0; 
  this.facing = 0; 
  this.lastPosition = new Vector3(0, 2, 0);
  this.states = {
    running: new Running(),
    death: new Death(),
  }
  this.isRunning = false; 
  this.position = pos; 
  this.setState('running'); //initial state
  //make mesh, set position
}

Robot.prototype.hasWallCollision = function(map) {

  //compensate for the fact that 0,0 is the center of the 3d Babylon map,  
  //but is upper left of the 2d map
  var xOnGrid = Math.round(this.position.x + map.width / 2);
  var yOnGrid = Math.round(map.height / 2 - this.position.z);
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
  console.log('handlingPlayerCollision');
  this.position.x = this.lastPosition.x;
  this.position.z = this.lastPosition.z;
};

Robot.prototype.handleWallCollision = function() {
  //stop movement, stop running, move back to previous position
   this.velocity = 0;
   this.stopRunning();
   this.position.x = this.lastPosition.x;
   this.position.z = this.lastPosition.z;
};


Robot.prototype.update = function(input) {
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
Robot.states = {
  running: new Running(),
  death: new Death(),
}

module.exports = Robot;