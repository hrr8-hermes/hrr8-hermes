function Robot(id,pos,mesh,skeleton) {
  this.id = id;
  this.accelerationForward = 1; //in seconds
  this.brakeSpeed = 0.8; //Acceleration removed per second
  this.speedDecay = 0.5; //percent of speed that dies per second 
  this.turnSpeed = 1; // rotation per second (~6.28 is a 360 degrees per second)
  this.maxSpeed = 10; //clamps the magnidue of speed vector
  this.velocity = 0;
  this.distance = -1;
  this._buildRobot(mesh, skeleton);
  this.pivot.position = pos;

  this.setState('running'); //initial state
  //make mesh, set position
  this.isRunning = false; 
  this.isBoosting = false;
}
Robot.prototype._buildRobot = function(mesh, skeleton) {
  this.mesh = mesh.clone(this.id + '_mesh'); 
  this.skeleton = skeleton.clone(this.id + '_skeleton'); 
  this.mesh.skeleton = this.skeleton; 
  this.mesh.rotation = new BABYLON.Vector3(0, Math.PI * 0.5, 0);
  this.pivot =  new BABYLON.Mesh.CreateBox(this.id + '_pivot',1,scene);
  this.pivot.isVisible = false; 
  this.mesh.parent = this.pivot; 
  this.mesh.position = BABYLON.Vector3.Zero(); 
  this.camPivot =  new BABYLON.Mesh.CreateBox(this.id + '_pivot',1,scene);
  this.camPivot.isVisible = false; 
  this.camPivot.parent = this.pivot; 
  this.camPivot.position = new BABYLON.Vector3(10,3, 0); 
};
Robot.prototype.update = function(input){
  if(input.robotModel.state.name !== this.state.name) {
    this.setState(input.robotModel.state.name);
  }
  if (this.distance !== input.robotModel.distance) reportLap(input.robotModel.distance,scene);
  this.distance = input.robotModel.distance;
  this.state.update(this,input); 
};
Robot.prototype.setState = function(name){
  var state = Robot.states[name];
  if(this.state && this.state.exitState){
    this.state.exitState(this); 
  }
  this.state = state; 
  if(this.state.enterState){
    this.state.enterState(this);
  } 
};
Robot.prototype.startRunning = function(){
  console.log('started running');
  scene.beginAnimation(this.skeleton,15,38,true,1.0); 
  this.isRunning = true; 
};
Robot.prototype.stopRunning = function(){
  scene.beginAnimation(this.skeleton,1,10,true,1.0); 
  this.isRunning = false;
};

Robot.states = {
  running: new Running(),
  death: new Death(), 
  boosting: new Boosting(),
  waiting: new Waiting()
};
