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
 *  loadAssets(assets, scale, scene, true, doStuff);
 *  
 *  Will load all assets into GPU and scene, then pass created meshes into doStuff
 */

var createdAssets = {};
function loadAssets(assetArray, scale, scene, ENABLED, callback) {

  var finished = readyGenerator(assetArray.length,callback);

  for (var i=0;i<assetArray.length;i++) {
    //TODO: make file string usage betters
    // as-is only accepts directory/name.ext
    var splitFile = assetArray[i].file.split('/');
    var dir = splitFile[0]+'/';

    BABYLON.SceneLoader.ImportMesh(assetArray[i].name, dir, splitFile[1], scene, function(meshes,particles,skeletons) {
      createdAssets[meshes[0].name] = meshes[0];
      createdAssets[meshes[0].name].setEnabled(ENABLED);
      createdAssets[meshes[0].name].scaling = new BABYLON.Vector3(scale,scale,scale);
      finished(true);
    });
  }

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
