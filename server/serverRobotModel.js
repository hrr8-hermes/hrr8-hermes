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
  this.maxSpeed = 1; //clamps the magnidue of speed vector
  this.velocity = 0; 
  this.facing = 0; 
//  this._buildRobot(mesh, skeleton);   (took these args out of function, only used for graphics)

  this.position = pos; 
  this.setState(states.running); //initial state
  //make mesh, set position
  this.isRunning = false; 
}
// Robot.prototype._buildRobot = function(mesh, skeleton) {
//   this.mesh = mesh.clone(this.id + '_mesh'); 
//   this.skeleton = skeleton.clone(this.id + '_skeleton'); 
//   this.mesh.skeleton = this.skeleton; 
//   this.pivot =  new BABYLON.Mesh.CreateBox(this.ide + '_pivot',1,scene);
//   this.pivot.isVisible = false; w
//   this.mesh.parent = this.pivot; 
//   this.mesh.position = Vector3.Zero(); 
// };
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