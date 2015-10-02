function Boosting(){
  this.name = "boosting";
  this.isBoosting = false; 
  this.isRunning = false; 
}

Boosting.prototype._input = function(serverData){
  var parsed = {}; 
  parsed.position =  new BABYLON.Vector3(serverData.robotModel.position.x, 1, serverData.robotModel.position.z);
  parsed.rotation = new BABYLON.Vector3(0, serverData.robotModel.facing * 2  * Math.PI + Math.PI * 0.5, 0);
  parsed.velocity = serverData.robotModel.velocity;
  parsed.energy = serverData.robotModel.energy;
  return parsed; 
};



Boosting.prototype.run = function(robot, parsedInput) {
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
    document.getElementById('energy').innerHTML = parsedInput.energy;
    document.getElementById('energy').style.clip = 'rect(0, '+parsedInput.energy+'px, 100px, 0)';
    camera.position = robot.camPivot.getAbsolutePosition();
    camera.setTarget(robot.pivot.position); 
  } 
  
  
  // if(shouldAnimateCam){
  //   //robot.camPivot.lookAt(robot.pivot,0,0,0);
  //   //camera.rotation = robot.camPivot.rotation;
  //   console.log(camera);
  // }
};


Boosting.prototype.update = function(robot,serverData){
  var parsedInput = this._input(serverData); 
  this.run(robot, parsedInput); 

};

Boosting.prototype.enterState = function() {

};

Boosting.prototype.exitState = function() {

};