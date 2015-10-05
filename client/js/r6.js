/* r6.js
 *
 * This file should contain actual scene rendering loops and any
 * additional setup code
 */

function runScene(meshes,sounds) {
  window.sounds = sounds;
  BABYLON.Engine.audioEngine.setGlobalVolume(0.1);
  window.NUM_LAPS = 2;
  window.LAP_DIST = 8;
  window.readyPressed = false;
  window.finished = false;
  createMaterials(); 
  var players = {};
  var startPos = { x: 200, y: 2.7, z : -66 };
  var bob = new Robot(0,new BABYLON.Vector3(startPos.x, startPos.y, startPos.z),meshes['Robot'],meshes['Robot'].skeleton);
  bob.mesh.material = materials.robot; 
  
  scene.clearColor = new BABYLON.Color3(0,0,0);

  meshes['track'].setEnabled(true);
  meshes['track'].scaling = new BABYLON.Vector3(1,1,1);
  meshes['buildings'].setEnabled(true);
  meshes['buildings'].scaling = new BABYLON.Vector3(1,1,1);

  // creates free-floating camera w/ default controls
  // click-drag to look, arrows to move, standard FP controls
  var freeCam = new BABYLON.FreeCamera('freeCam', new BABYLON.Vector3(0,300,-90), scene);
  freeCam.attachControl(canvas);
  
  // 0,0,0 visualization
  var origin = new BABYLON.Mesh.CreateSphere('origin', 20, 10, scene);
  origin.position = new BABYLON.Vector3(0,0,0);
  origin.material = new BABYLON.StandardMaterial('originmat',scene);
  origin.material.emissiveColor = new BABYLON.Color3(1,0,0);

  // followcam
  window.camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(0,5,-10), scene);
  camera.attachControl(canvas,false);
  scene.activeCamera = camera;

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
  /*
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,10,0),scene);
  light.diffuse = new BABYLON.Color3(1,1,1);
  light.specular = new BABYLON.Color3(1,1,1);
  light.groundColor = new BABYLON.Color3(0,0,0);
  light.rotation = new BABYLON.Vector3(Math.PI * 0.25,0,0);
  */

  // ambient light that allows for shadows
  var light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(0,0,0.2), scene);
  light2.diffuse = new BABYLON.Color3(1,1,1);
  light2.specular = new BABYLON.Color3(1,1,1);
  light2.parent = camera;
  light2.position = new BABYLON.Vector3(3,30,10);
  // sphere to visualize light position
  /*
  var lightSphere = new BABYLON.Mesh.CreateSphere('lightPos', 10, 2, scene);
  lightSphere.position = light2.position;
  lightSphere.material = new BABYLON.StandardMaterial('lightPos1',scene);
  lightSphere.material.emissiveColor = new BABYLON.Color3(1,1,0);

  // random box for light tests
  /*
  var testBox = new BABYLON.Mesh.CreateBox('tbox', 5, scene);
  testBox.material = new BABYLON.StandardMaterial('tbox1',scene);
  testBox.material.emissiveColor = new BABYLON.Color3(0,1,1);
  testBox.position = new BABYLON.Vector3(0,0.5,10);
  */

  // shines light from freecamera position down/left/forward
  var light3 = new BABYLON.SpotLight('spotlight', new BABYLON.Vector3(0,5,0), new BABYLON.Vector3(0,-0.3,0.6), 0.8,4, scene);
  light3.diffuse = new BABYLON.Color3(1,1,1);
  light3.specular = new BABYLON.Color3(1,1,1);
  light3.parent = camera;

  // enable shadows for bob
  var shadowGenerator = new BABYLON.ShadowGenerator(1024,light2);
  shadowGenerator.getShadowMap().renderList.push(bob.mesh);
  //shadowGenerator.getShadowMap().renderList.push(testBox);
  //BlurVarianceShadowMap _needed_ to get shadow to render w/ directional light
  shadowGenerator.useBlurVarianceShadowMap = true;
  /*
  var spotShadows = new BABYLON.ShadowGenerator(2048,light3);
  spotShadows.getShadowMap().renderList.push(bob.mesh);
  spotShadows.useBlurVarianceShadowMap = true;
  */
  meshes['track'].receiveShadows = true;
  meshes['buildings'].receiveShadows = true;
  

  sounds.bg1.loop = true;
  sounds.bg1.autoplay = true;
  sounds.bg1.setVolume(1.8);
  sounds.bg1.play();

  scene.clearColor = new BABYLON.Color3(0.05,0.05,0.05);

  // start rendering
  engine.runRenderLoop(function() {
    // keep freecam on bob for now
    //freeCam.setTarget(bob.pivot.position);
    //light3.setDirectionToTarget(camera.position);
    scene.render();
    applyPositions(); 
  });
  
  // keep Babylon rendering at same scale as canvas
  window.addEventListener('resize', function() {
    engine.resize();
  });

  // additional listeners for debugging
  // use 'f' to flip cams through follow, chase, and free
  // use 'p' to toggle debug layer
  var switchcam = 0;
  var switchdebug = true;
  var togglemusic = true;

  window.addEventListener('keydown', function(e) {
    
    if (e.keyCode===70) {
      if (switchcam===0) {       
        scene.activeCamera = chaseCam;
      } else if (switchcam===1) {
        scene.activeCamera = camera;
      } else {
        freeCam.setTarget(origin.position);
        scene.activeCamera = freeCam;
      }
      switchcam = (switchcam<2)?switchcam+1:0;
    }
    if (e.keyCode===80) {
      if (switchdebug) {
        scene.debugLayer.show();
      } else {
        scene.debugLayer.hide();
      }
      switchdebug = !switchdebug;
    }

    // M to stop track
    if (e.keyCode === 77) {
      if (togglemusic) {
        sounds.bg1.stop();
      } else {
        sounds.bg1.play();
      }
      togglemusic = !togglemusic;
    }

    if (e.keyCode === 76) {
     reportLap(bob.distance,scene);
    }
  });
  //Connect to server once the scene is loaded to not miss any events
  window.socket = socket = io();
  socket.on('connect', function() {
    console.log('Connected');
  });
  var applyPositions = function(){
    if(window.positions) {
      for (var serverPlayerId in window.positions) {
        if (players[serverPlayerId]) {
          var serverPlayer = window.positions[serverPlayerId];
          players[serverPlayerId].update(serverPlayer);
        }
      }
    }
  };
  socket.on('positions', function(data) {
    window.positions = data; 
  });
  //a new player has connected
  socket.on('playerConnected', function(playerData) {
    var set = new Robot(playerData.socketId,new BABYLON.Vector3(startPos.x, startPos.y, startPos.z),meshes['Robot'],meshes['Robot'].skeleton);
    set.mesh.material = materials.robot; 
    players[playerData.socketId] = set;
  });
  
  socket.on('raceStarting', function() {
    console.log('race started');
    bob.distance = 0;
    reportLap(bob.distance,scene);
  });

  socket.on('finished', function(numPlayersFinished) {
    console.log('all done!');
    var indexInPlaces = numPlayersFinished;
    var places = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    document.getElementById('info').innerHTML = 'You finished in '
      + places[indexInPlaces] + '!<br/>Press enter to join a new game.';
    window.finished = true;  
  });
  socket.on('countdown', function() {
    console.log('counting down');
    var countdown = document.getElementById('info');
    var countdownText = ['3..', '2..', '1..', 'GO!', ''];
    var index = 0;
    var counter = function() {
      countdown.innerHTML = countdownText[index];
      index++;
      if (index < countdownText.length) {
        setTimeout(counter, 1000);
      }
    };
    counter();
  });

  socket.on('connected', function(data) {
    //receives a object of connected players
    for (var playerId in data) {
      var player = data[playerId];
      var set;
      if(player.socketId === socket.id) {
        bob.id = socket.id;
        set = bob;
      } else {
        set = new Robot(player.socketId,new BABYLON.Vector3(startPos.x, startPos.y, startPos.z),meshes['Robot'],meshes['Robot'].skeleton);
        set.mesh.material = materials.robot; 
      }  
      players[player.socketId] = set;
    }
  });

  socket.on('playerDisconnected', function(player) {
      if(players[player.socketId]) {
        players[player.socketId].pivot.dispose();
        delete players[player.socketId];
      }
  });
  //if we ever want to display the png client side (for testing or something)
  // socket.on('image data to display', function(data) {
  //   var canvas2 = document.createElement('CANVAS');
  //    canvasWidth = 512;
  //    canvasHeight = 512;
  //    canvas2.width = canvasWidth;
  //    canvas2.height = canvasHeight;
  //    //canvas.id = 'canvas';
  //    canvas2.style.position = 'absolute';
  //    canvas2.style.top = '0';
  //    canvas2.style.left = '0';
  //   var context = canvas2.getContext('2d');
  //   var imageData = context.createImageData(512, 512);
  //   console.log(data[0]);
  //   for (var i = 0; i < imageData.data.length; i++) {
  //     imageData.data[i] = data[i];
  //   }
  //   console.log(imageData.data[4]);

  //   context.putImageData(imageData, 0, 0);
  //   document.body.appendChild(canvas2);
  // });
  // //roundabout way to process the .png


}

