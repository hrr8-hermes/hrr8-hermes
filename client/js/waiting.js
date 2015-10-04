function Waiting() {
  this.name = "waiting";
  this.isRunning = false; 
  this.isBoosting = false; 
  this.isStopped = false;
}


Waiting.prototype.update = function(robot, serverData) {
  var parsedInput = this._input(serverData, robot);
  robot.pivot.position = parsedInput.position;
  robot.pivot.rotation = parsedInput.rotation;
  robot.velocity = parsedInput.velocity;
  if (robot.id === socket.id) {
    camera.position = robot.camPivot.getAbsolutePosition();
    camera.setTarget(robot.pivot.position);
  }   

};

//still have to receive and apply server data,
//or robot won't be moved back to the starting point
//if the waiting state is applied before the new positional data
//is interpreted
Waiting.prototype._input = function(serverData, robot) {
  var parsed = {}; 
  parsed.position =  new BABYLON.Vector3(serverData.robotModel.position.x, robot.pivot.position.y, serverData.robotModel.position.z);
  parsed.rotation = new BABYLON.Vector3(0, serverData.robotModel.facing * 2  * Math.PI + Math.PI * 0.5, 0);
  parsed.velocity = serverData.robotModel.velocity;
  parsed.energy = serverData.robotModel.energy;
  return parsed; 
};

Waiting.prototype.enterState = function(robot) {
  console.log('waiting');
  //to stop the running animation
  robot.stopRunning();
};

Waiting.prototype.exitState = function(robot) {
  console.log('client side, exiting waiting');
};

module.exports = Waiting;