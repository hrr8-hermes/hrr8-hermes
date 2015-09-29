/* loader.js
 *
 *   Receives an array of objects of babylon files (as strings) and
 *   names, the scene to add them to, whether the assets should
 *   be preloaded (TRUE/FALSE), and a callback for when
 *   all assets are loaded
 *
 * Example: 
 *
 *  var assets = [
 *    {name : 'skitter',
 *     file : 'Assets/skitter.babylon'},
 *    {name : '',
 *     file : 'Assets/environment.babylon'},
 *    {name : 'robot1',
 *     file : 'Assets/robots.babylon'},
 *    {name : 'robot2',
 *     file : 'Assets/robots.babylon'}
 *    ];
 *  loadAssets(assets, scene, true, doStuff);
 *  
 *  Will load all assets into GPU and scene, then pass created meshes into doStuff
 */

var createdAssets = {};
function loadAssets(assetArray, scene, ENABLED, callback) {

  var finished = readyGenerator(assetArray.length,callback);

  for (var i=0;i<assetArray.length;i++) {
    //TODO: make file string usage betters
    // as-is only accepts directory/name.ext
    var splitFile = assetArray[i].file.split('/');
    var dir = splitFile[0]+'/';

    BABYLON.SceneLoader.ImportMesh(assetArray[i].name, dir, splitFile[1], scene, function(meshes,particles,skeletons) {
      createdAssets[meshes[0].name] = meshes[0];
     // createdAssets[assetArray[i].name].setEnabled(ENABLED);
      finished(true);
    });

  }
  /*
  BABYLON.SceneLoader.ImportMesh('','Assets/','testEnv.babylon', scene, function(envMeshes) {
    envMeshes[0].material = groundMat;
    envMeshes[0].material.receiveShadows = true;
    envMeshes[1].position = new BABYLON.Vector3(200,0,0);
    for(var i = 0; i < envMeshes.length; i++){
      envMeshes[i].scaling = new BABYLON.Vector3(0.1,0.1,0.1);
      envMeshes[i].receiveShadows = true;
    }

    BABYLON.SceneLoader.ImportMesh("Skitter", "Assets/", "enemy@idleRun.babylon", scene, function (newMeshes, particleSystems, skeletons) {
      robotMesh = newMeshes[0];
      robotMesh.scaling = new BABYLON.Vector3(0.02,0.02,0.02);
      robotMesh.position = new BABYLON.Vector3(0,0,0); 
      robotMesh.setEnabled(false);

      readyGo();
    });
  });
  */

}

function readyGenerator(waitUntil,cb) {
  var count = 0;
  return function(finished) {
    if (finished) count++;
    if (count===waitUntil) {
      cb(createdAssets);
    }
  };
}
