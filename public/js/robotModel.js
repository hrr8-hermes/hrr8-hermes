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
  this.velocity = new BABYLON.Vector3(0,0,0); 
  this._buildRobot(mesh, skeleton);
  this.pivot.position = pos; 
  this.setState(states.running); //initial state
  //make mesh, set position
  this.isRunning = false; 
}
Robot.prototype._buildRobot = function(mesh, skeleton){
  this.mesh = mesh.clone(this.id + '_mesh'); 
  this.skeleton = skeleton.clone(this.id + '_skeleton'); 
  this.mesh.skeleton = this.skeleton; 
  this.pivot =  new BABYLON.Mesh.CreateBox(this.ide + '_pivot',1,scene);
  this.pivot.isVisible = false; 
  this.mesh.parent = this.pivot; 
  this.mesh.position = BABYLON.Vector3.Zero(); 
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

Running.prototype._input = function(inputObj){
  var x = 0;
  var z = 0;  
  x+=inputObj.RIGHT; 
  x-=inputObj.LEFT; 
  z+=inputObj.FORWARD * 1;
  z-=inputObj.BACK * 0.6; 
  var currentInput = []; 
  currentInput[0] = new BABYLON.Vector3(z*-1,0,0); 
  currentInput[1] = x; 
  return currentInput; 
};
Running.prototype.run = function(robot, parsedInput){

  var currentAccl;
  if (parsedInput[0].equals(BABYLON.Vector3.Zero()) ){
    robot.velocity.addInPlace(robot.velocity.scale(-1 * robot.speedDecay * engine.getDeltaTime() / 1000));
    if(robot.velocity.lengthSquared() < 0.1){
      robot.velocity = new BABYLON.Vector3.Zero(); 
    }
  } else {
    currentAccl = parsedInput[0].scale(robot.accelerationForward * engine.getDeltaTime() / 1000);
    robot.velocity.addInPlace(currentAccl); //velocity = velocity + accl
  }
  this._runCheck(robot); 
  robot.pivot.translate(robot.velocity, 1, BABYLON.Space.Local); //position = position + velocity;
  var currentRot = parsedInput[1] * robot.turnSpeed * engine.getDeltaTime() / 1000;
  robot.pivot.rotatePOV(0,currentRot,0);
};

Running.prototype._runCheck = function(robot){
  if(!robot.isRunning && robot.velocity.x !== 0){
    robot.startRunning();
    return;  
  }
  if(robot.isRunning && robot.velocity.x === 0){
    robot.stopRunning(); 
  }
};

Running.prototype.update = function(robot,inputObj){
  var parsedInput = this._input(inputObj); 
  this.run(robot, parsedInput); 
};

Running.prototype.enterState = function() {

};

Running.prototype.exitState = function() {

};

