var settings = require('../robotModelSettings.js');

function Running() {
  this.name = "running";
  this.isRunning = false; 
  this.isBoosting = false; 
}
Running.prototype._input = function(inputObj){
  var x = 0;
  var z = 0;  
  x-=inputObj.KA ? inputObj.KA : 0; 
  x+=inputObj.KD ? inputObj.KD : 0; 
  z+=inputObj.KW ? inputObj.KW * 1 : 0;
  z-=inputObj.KS ? inputObj.KS * 0.6 : 0;
  var currentInput = []; 
  currentInput[0] = z; 
  currentInput[1] = x; 
  currentInput[2] = inputObj.KE
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
    currentAccl = parsedInput[0] *  settings.runningAcclMultiplier * robot.accelerationForward * robot.delta.deltaValue / 1000;
    robot.velocity += currentAccl; //velocity = velocity + accl
    if(robot.velocity >= robot.maxRunSpeed) {
      robot.velocity = robot.maxRunSpeed;
    }
  }
  
  robot.facing += parsedInput[1] * robot.turnSpeed * robot.delta.deltaValue / 1000;
  robot.forwardNormX = Math.sin(robot.facing * Math.PI * 2); 
  robot.forwardNormY = Math.cos(robot.facing * Math.PI * 2);
  //save this position before moving in case there is a collision


  robot.lastPosition.addToTail({x: robot.position.x, z: robot.position.z});

  if(robot.lastPosition.length >= settings.savedPositions) {
    robot.lastPosition.removeHead();
  }


  //advance position
  robot.position.x += robot.velocity * robot.forwardNormX;
  robot.position.z += robot.velocity * robot.forwardNormY;


};

//the core update loop while in the running state
Running.prototype.update = function(robot,inputObj){
  //if you aren't changing states, do the running thing
  if(!this.changeState(robot, inputObj)){
    var parsedInput = this._input(inputObj);

    robot.increaseEnergy(settings.runningHealthGain); 

    this.run(robot, parsedInput); 
  }
};
//controls if the robot should change state. NOTE: Death isn't handled here. 
Running.prototype.changeState = function(robot, inputObj){
  if(inputObj['K ']){
    robot.setState('boosting'); 
    return true;
  }
  return false; 
};
Running.prototype.enterState = function(robot) {
  console.log('robot id: ' + robot.id + ' enters running state');
  robot.startRunning(); 
};

Running.prototype.exitState = function(robot) {
  console.log('robot id: ' + robot.id + ' exits running state');
  robot.stopRunning(); 
};

module.exports = Running;