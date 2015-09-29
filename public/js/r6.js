/* r6.js
 *
 * This file should contain actual scene rendering loops and any
 * additional setup code
 */

function runScene(meshes) {
  var bob = new Robot(0,new BABYLON.Vector3(0,0.3,0),meshes['Skitter'],meshes['Skitter'].skeleton);

  // ground
  meshes['Plane001'].setEnabled(true);
  meshes['Plane001'].scaling = new BABYLON.Vector3(0.1,0.1,0.1);
  meshes['Plane001'].material.diffuseTexture.uScale = 0.1;
  meshes['Plane001'].material.diffuseTexture.vScale = 0.1;
  meshes['Plane001'].material.specularColor = new BABYLON.Color3(0,0,0);
  // columns
  meshes['Cylinder014'].setEnabled(true);
  meshes['Cylinder014'].scaling = new BABYLON.Vector3(0.1,0.1,0.1);
  meshes['Cylinder014'].position = new BABYLON.Vector3(200,0,-70);

  // creates free-floating camera w/ default controls
  // click-drag to look, arrows to move, standard FP controls
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0,5,-10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas,false);

  // toggle to cam following our robot bob
  // radius is distance to maintain, height/rotation is as it sounds
  // acceleration is relative to target object
  // max allows fast-moving object to pull away
  var chaseCam = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(2,3,1), scene);
  chaseCam.target = bob.pivot;
  chaseCam.radius = 7;
  chaseCam.heightOffset = 2;
  chaseCam.rotationOffset = 90;
  chaseCam.cameraAcceleration = 0.1;
  chaseCam.maxCameraSpeed = 10;

  // light the entire scene with ambient
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0),scene);
  light.diffuse = new BABYLON.Color3(1,1,1);
  light.specular = new BABYLON.Color3(1,1,1);
  light.groundColor = new BABYLON.Color3(0,0,0);

  // ambient light that allows for shadows
  /*
  var light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(0,-1,0), scene);
  light2.position = new BABYLON.Vector3(0,40,40);
  // sphere to visualize light position
  var lightSphere = new BABYLON.Mesh.CreateSphere('lightPos', 10, 2, scene);
  lightSphere.position = light2.position;
  lightSphere.material = new BABYLON.StandardMaterial('lightPos1',scene);
  lightSphere.material.emissiveColor = new BABYLON.Color3(1,1,0);

  // random box for light tests
  var testBox = new BABYLON.Mesh.CreateBox('tbox', 5, scene);
  testBox.material = new BABYLON.StandardMaterial('tbox1',scene);
  testBox.material.emissiveColor = new BABYLON.Color3(0,1,1);
  testBox.position = new BABYLON.Vector3(0,0.5,10);
  */

  // shines red light from freecamera position down/left/forward
  var light3 = new BABYLON.SpotLight('spotlight', new BABYLON.Vector3(4,5,-10), new BABYLON.Vector3(-0.2,-0.4,1), 0.8,4, scene);
  light3.diffuse = new BABYLON.Color3(1,0,0);
  light3.specular = new BABYLON.Color3(1,1,1);

  // enable shadows for bob
  /*
  var shadowGenerator = new BABYLON.ShadowGenerator(1024,light2);
  shadowGenerator.getShadowMap().renderList.push(bob.mesh);
  //shadowGenerator.getShadowMap().renderList.push(testBox);
  // BlurVarianceShadowMap _needed_ to get shadow to render w/ directional light
  shadowGenerator.useBlurVarianceShadowMap = true;
  meshes['Plane001'].receiveShadows = true;
  */

  // start rendering
  engine.runRenderLoop(function() {
    // keeps the spot at camera's location
    light3.position = camera.position;
    bob.update(USER_INPUT); 
    scene.render();
  });
  
  // keep Babylon rendering at same scale as canvas
  window.addEventListener('resize', function() {
    engine.resize();
  });

  // additional listeners for debugging
  // use 'f' to switch between follow & chase cam
  // use 'p' to toggle debug layer
  var switchcam = false;
  var switchdebug = true;
  window.addEventListener('keydown', function(e) {
    if (e.keyCode===70) {
      if (switchcam) {
        scene.activeCamera = camera;
      } else {
        scene.activeCamera = chaseCam;
      }
      switchcam = !switchcam;
    }
    if (e.keyCode===80) {
      if (switchdebug) {
        scene.debugLayer.show();
      } else {
        scene.debugLayer.hide();
      }
      switchdebug = !switchdebug;
    }
  });
}