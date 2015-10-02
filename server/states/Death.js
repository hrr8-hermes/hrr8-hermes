function Death() {
  this.name = "death";
  this.isRunning = false; 
  this.isBoosting = false; 
}


Death.prototype.update = function(robot,inputObj){
};

Death.prototype.enterState = function(robot) {
  setTimeout(function(){
    robot.setState('running')
  },3000)
};

Death.prototype.exitState = function(robot) {
  var pos = robot.lastPosition[0];
  robot.position.x = pos.x;
  robot.position.z = pos.z;
  robot.energy = 5;
};

module.exports = Death;