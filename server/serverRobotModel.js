states = {}; 
states.running = new Running();
var Vector3 = require('./Vector3.js');
// states.death = new Death(); 
// states.outOfEnergy = new outOfEnergy(); 

function Robot(delta,id,pos) {
  //console.log(this);
  this.delta = delta;
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.4; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = .5; // rotation per second (~6.28 is a 360 degrees per second)
  
  //TEMPORARY
  this.maxSpeed = 1; //clamps the magnidue of speed vector
// this.maxSpeed = 1;
  this.velocity = 0; 
  this.facing = 0; 
//  this._buildRobot(mesh, skeleton);   (took these args out of function, only used for graphics)
  this.position = pos; 
  this.lastPosition = new Vector3(0, 2, 0);
  this.setState(states.running); //initial state
  //make mesh, set position
  this.isRunning = false; 
}

Robot.prototype.hasWallCollision = function(map) {
  //compensate for the fact that 0,0 is the center of the 3d map,  
  //but is upper left of the 2d map
   // console.log('3d x: ', this.position.x);
   // console.log('3d y: ', this.position.z);
  
  var xOnGrid = Math.round(this.position.x + map.width / 2);
  var yOnGrid = Math.round(map.height / 2 - this.position.z);
   // console.log('xOnGrid', xOnGrid);
   // console.log('yOnGrid', yOnGrid);
  //out of bounds
  //this should never happen
  if (map.grid[yOnGrid] === undefined || map.grid[yOnGrid][xOnGrid] === undefined) {
    this.handleWallCollision();
    console.log('ERROR: out of course bounds');
  } else {
    //console.log(map.grid[yOnGrid][xOnGrid]);
    return map.grid[yOnGrid][xOnGrid] === 0;
  }
  //0 means a black pixel (wall) 
  //commented out for now - crashes server because 3d and 2d maps 
  //are not the same (tries to access outside bounds of array)


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
Robot.prototype.setState = function(state) {
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

function Running() {
  this.isRunning = false; 
  this.isBoosting = false; 
}
Running.prototype._input = function(inputObj){
  var x = 0;
  var z = 0;  
  x+=inputObj.RIGHT; 
  x-=inputObj.LEFT; 
  z+=inputObj.FORWARD * 1;
  z-=inputObj.BACK * 0.6; 
  var currentInput = []; 
  currentInput[0] = z; 
  currentInput[1] = x; 
  return currentInput; 
};
Running.prototype.run = function(robot, parsedInput) {
  var currentAccl;
  if (parsedInput[0] === 0) {
    robot.velocity -= robot.velocity * robot.speedDecay * robot.delta.deltaValue / 1000;
    if (robot.velocity < 0.05) {
      robot.velocity = 0; 
    }
  } else {
    currentAccl = parsedInput[0] * robot.accelerationForward * robot.delta.deltaValue / 1000;
    robot.velocity += currentAccl; //velocity = velocity + accl
    if(robot.velocity >= robot.maxSpeed) {
      robot.velocity = robot.maxSpeed;
    }
  }
  this._runCheck(robot); 
  //robot.position.addInPlace(robot.velocity); //position = position + velocity;
  
  robot.facing += parsedInput[1] * robot.turnSpeed * robot.delta.deltaValue / 1000;
  //robot.currentRot = parsedInput[1] * robot.turnSpeed * robot.delta.deltaValue / 1000;
  robot.forwardNormX = Math.sin(robot.facing * Math.PI * 2); 
  robot.forwardNormY = Math.cos(robot.facing * Math.PI * 2); 
  //save previous position in case this move results in a collision
  robot.lastPosition.x = robot.position.x;
  robot.lastPosition.z = robot.position.z; 
  robot.position.x += robot.velocity * robot.forwardNormX;
  robot.position.z += robot.velocity * robot.forwardNormY;
};

Running.prototype._runCheck = function(robot) {
  if(!robot.isRunning && robot.velocity.x !== 0) {
    robot.startRunning();
    return;  
  }
  if(robot.isRunning && robot.velocity.x === 0) {
    robot.stopRunning(); 
  }
};

Running.prototype.update = function(robot,inputObj){
  var parsedInput = this._input(inputObj); 
  this.run(robot, parsedInput); 
};

Running.prototype.enterState = function() {

};

Running.prototype.exitState = function() {

};

module.exports = Robot;