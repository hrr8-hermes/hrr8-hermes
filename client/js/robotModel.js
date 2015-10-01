states = {}; 
states.running = new Running();
// states.death = new Death(); 
// states.outOfEnergy = new outOfEnergy(); 

function Robot(id,pos,mesh,skeleton) {
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.8; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = 1; // rotation per second (~6.28 is a 360 degrees per second)
  this.maxSpeed = 10; //clamps the magnidue of speed vector
  this.velocity = 0; 
  this._buildRobot(mesh, skeleton);
  this.pivot.position = pos; 
  this.setState(states.running); //initial state
  //make mesh, set position
  this.isRunning = false; 
}
Robot.prototype._buildRobot = function(mesh, skeleton) {
  this.mesh = mesh.clone(this.id + '_mesh'); 
  this.skeleton = skeleton.clone(this.id + '_skeleton'); 
  this.mesh.skeleton = this.skeleton; 
  this.pivot =  new BABYLON.Mesh.CreateBox(this.ide + '_pivot',1,scene);
  this.pivot.isVisible = false; 
  this.mesh.parent = this.pivot; 
  this.mesh.position = BABYLON.Vector3.Zero(); 
  this.camPivot =  new BABYLON.Mesh.CreateBox(this.ide + '_pivot',1,scene);
  this.camPivot.isVisible = false; 
  this.camPivot.parent = this.pivot; 
  this.camPivot.position = new BABYLON.Vector3(10,3, 0); 
};
Robot.prototype.update = function(input){
  this.state.update(this,input); 
};
Robot.prototype.setState = function(state){
  if(this.state && this.state.exitState){
    this.state.exitState(this); 
  }
  this.state = state; 
  if(this.state.enterState){
    this.state.enterState(this);
  } 
};
Robot.prototype.startRunning = function(){
  scene.beginAnimation(this.skeleton,16,32,true,1.0); 
  this.isRunning = true; 
};
Robot.prototype.stopRunning = function(){
  scene.beginAnimation(this.skeleton,0,10,true,1.0); 
  this.isRunning = false;
};

function Running(){
  this.isRunning = false; 
  this.isBoosting = false; 
}

Running.prototype._input = function(serverData){
  var parsed = {}; 
  parsed.position =  new BABYLON.Vector3(serverData.robotModel.position.x, 0.3, serverData.robotModel.position.z);
  parsed.rotation = new BABYLON.Vector3(0, serverData.robotModel.facing * 2  * Math.PI + Math.PI * 0.5, 0);
  parsed.velocity = serverData.robotModel.velocity;
  return parsed; 
};

Running.prototype._runCheck = function(robot){
  if(!robot.isRunning && robot.velocity !== 0){
    robot.startRunning();
    return;  
  }
  if(robot.isRunning && robot.velocity === 0){
    robot.stopRunning(); 
  }
};

Running.prototype.run = function(robot, parsedInput) {
  if((!robot.pivot.rotation.equals(parsedInput.rotation) ||
    !robot.pivot.position.equals(parsedInput.position)) &&
    robot.id === socket.id){
    camera.position = robot.camPivot.getAbsolutePosition();
  }
  robot.pivot.position = parsedInput.position; 
  robot.pivot.rotation = parsedInput.rotation; 
  robot.velocity = parsedInput.velocity; 
};


Running.prototype.update = function(robot,serverData){
  var parsedInput = this._input(serverData); 
  this.run(robot, parsedInput); 
  this._runCheck(robot); 
};

Running.prototype.enterState = function() {

};

Running.prototype.exitState = function() {

};

