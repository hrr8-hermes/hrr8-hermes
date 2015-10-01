var Vector3 = require('./Vector3.js');
var Running = require('./states/Running.js')

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
  this.states = {
    running: new Running(),
    //death: new Death(),
  }
  this.position = pos; 
  this.setState(this.states.running); //initial state
  //make mesh, set position
  this.isRunning = false; 
}
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

module.exports = Robot;