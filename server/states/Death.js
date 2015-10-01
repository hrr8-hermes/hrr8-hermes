function Death() {
  this.name = "death";
  this.isRunning = false; 
  this.isBoosting = false; 
}
Death.prototype._input = function(inputObj){
  var x = 0;
  var z = 0;  
  x-=inputObj.KA ? inputObj.KA : 0; 
  x+=inputObj.KD ? inputObj.KD : 0; 
  z+=inputObj.KW ? inputObj.KW * 1 : 0;
  z-=inputObj.KS ? inputObj.KS * 0.6 : 0;
  var currentInput = []; 
  currentInput[0] = z; 
  currentInput[1] = x; 
  return currentInput; 
};
Death.prototype.run = function(robot, parsedInput) {
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
  
  robot.facing += parsedInput[1] * robot.turnSpeed * robot.delta.deltaValue / 1000;
  robot.forwardNormX = Math.sin(robot.facing * Math.PI * 2); 
  robot.forwardNormY = Math.cos(robot.facing * Math.PI * 2); 
  robot.position.x += robot.velocity * robot.forwardNormX;
  robot.position.z += robot.velocity * robot.forwardNormY;
};


Death.prototype.update = function(robot,inputObj){
  var parsedInput = this._input(inputObj); 
  this.run(robot, parsedInput); 
};

Death.prototype.enterState = function() {

};

Death.prototype.exitState = function() {

};

module.exports = Death;