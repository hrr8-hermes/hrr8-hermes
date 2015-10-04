function Death() {
  this.name = "death";
  this.isRunning = false; 
  this.isBoosting = false; 
}


Death.prototype.update = function(robot,inputObj){
};

Death.prototype.enterState = function(robot) {
  console.log('dead!');
  setTimeout(function(){
    robot.setState('running');
  },1000);
};

Death.prototype.exitState = function(robot) {
  var pos = robot.lastPosition.head.value;
  robot.position.x = pos.x;
  robot.position.z = pos.z;
  robot.energy = 100;
  robot.velocity = 0;
};

module.exports = Death;