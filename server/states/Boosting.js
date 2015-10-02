function Boosting() {
  this.name = "boosting";
  this.isRunning = false; 
  this.isBoosting = false;
  this.updateCounter = 0; 
}
Boosting.prototype._input = function(inputObj){
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
Boosting.prototype.run = function(robot, parsedInput) {
  var currentAccl;
  if (parsedInput[0] === 0) {
    robot.velocity -= robot.velocity * robot.speedDecay * robot.delta.deltaValue / 1000;
    if (robot.velocity < 0.05) {
      robot.velocity = 0; 
    }
  } else {
    currentAccl = parsedInput[0] *  1 * robot.accelerationForward * robot.delta.deltaValue / 1000;
    robot.velocity += currentAccl; //velocity = velocity + accl
    if(robot.velocity >= robot.maxBoostSpeed) {
      robot.velocity = robot.maxBoostSpeed;
    }
  }
  robot.facing += parsedInput[1] * robot.turnSpeed * robot.delta.deltaValue / 1000;
  robot.forwardNormX = Math.sin(robot.facing * Math.PI * 2); 
  robot.forwardNormY = Math.cos(robot.facing * Math.PI * 2);
  //save this position before moving in case there is a collision
  robot.lastPosition[0].x = robot.position.x;
  robot.lastPosition[0].z = robot.position.z;
  // robot.lastPosition.push({x: robot.position.x, z: robot.position.z});

  // if(robot.lastPosition.length >= 2) {
  //   robot.lastPosition.shift();
  // }
  //advance position
  robot.position.x += robot.velocity * robot.forwardNormX;
  robot.position.z += robot.velocity * robot.forwardNormY;
};


Boosting.prototype.update = function(robot,inputObj){
  var parsedInput = this._input(inputObj); 
  //deplete energy while boosting
  this.updateCounter++;
  if (this.updateCounter === 20) {
      robot.decreaseEnergy(1);
      this.updateCounter = 0;
  }
  this.run(robot, parsedInput); 
};

Boosting.prototype.enterState = function() {

};

Boosting.prototype.exitState = function() {

};

module.exports = Boosting;