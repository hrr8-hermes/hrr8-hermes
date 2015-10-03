function Waiting() {
  this.name = "waiting";
  this.isRunning = false; 
  this.isBoosting = false; 
}


Waiting.prototype.update = function(robot,inputObj) {
  // robot.position.x += robot.velocity * robot.forwardNormX;
  // robot.position.z += robot.velocity * robot.forwardNormY;
};

Waiting.prototype.enterState = function(robot) {
  console.log('waiting');
  setTimeout(function() {
    robot.setState('running');
  }, 1500);

};

Waiting.prototype.exitState = function(robot) {
  console.log('server side, exiting waiting');
};

module.exports = Waiting;