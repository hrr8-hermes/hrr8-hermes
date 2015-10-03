function Death(){
  this.name = "death";
  this.isRunning = false; 
  this.isBoosting = false; 
}

Death.prototype._input = function(serverData){
  var parsed = {}; 
  parsed.position =  new BABYLON.Vector3(serverData.robotModel.position.x, 0.3, serverData.robotModel.position.z);
  parsed.rotation = new BABYLON.Vector3(0, serverData.robotModel.facing * 2  * Math.PI + Math.PI * 0.5, 0);
  parsed.velocity = serverData.robotModel.velocity;
  return parsed; 
};

Death.prototype._runCheck = function(robot){
  if(!robot.isRunning && robot.velocity !== 0){
    robot.startRunning();
    return;  
  }
  if(robot.isRunning && robot.velocity === 0){
    robot.stopRunning(); 
  }
};

Death.prototype.run = function(robot, parsedInput) {
  // var shouldAnimateCam = false; 
  // if((!robot.pivot.rotation.equals(parsedInput.rotation) ||
  //   !robot.pivot.position.equals(parsedInput.position)) &&
  //   robot.id === socket.id){
  //   shouldAnimateCam = true; 
  // }
  robot.pivot.position = parsedInput.position; 
  robot.pivot.rotation = parsedInput.rotation; 
  robot.velocity = parsedInput.velocity;
  if(robot.id === socket.id) {
    camera.position = robot.camPivot.getAbsolutePosition();
    camera.setTarget(robot.pivot.position); 
  } 
  
  
  // if(shouldAnimateCam){
  //   //robot.camPivot.lookAt(robot.pivot,0,0,0);
  //   //camera.rotation = robot.camPivot.rotation;
  //   console.log(camera);
  // }
};


Death.prototype.update = function(robot,serverData){
  var parsedInput = this._input(serverData); 
  this.run(robot, parsedInput); 
  this._runCheck(robot); 
};

Death.prototype.enterState = function(robot) {
  robot.mesh.isVisible = false; 
  vfx.explosion(robot.mesh); 
  console.log("entering death state");
};

Death.prototype.exitState = function(robot) {
  robot.mesh.isVisible = true; 
  console.log("exiting death state");
};
