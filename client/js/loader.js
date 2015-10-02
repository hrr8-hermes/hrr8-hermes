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
 *     type : 'mesh',
 *     file : 'Assets/skitter.babylon'},
 *    {name : 'robot1',
 *     type : 'mesh',
 *     file : 'Assets/robots.babylon'},
 *    {name : 'industfunk',
 *     type : 'sound',
 *     file : 'sounds/bg/industfunk.wav'},
 *    {name : 'boom1',
 *     type : 'sound',
 *     file : 'sounds/boom1.wav'}
 *    ];
 *  loadAssets(assets, scale, scene, true, doStuff);
 *  
 *  Will load all assets into GPU and scene, then pass created meshes into doStuff
 */

var createdAssets = {};
var tasks = {};
function loadAssets(assetArray, scale, scene, ENABLED, callback) {

  engine.loadingUIBackgroundColor = 'black';
  var assetManager = new BABYLON.AssetsManager(scene);

  assetArray.forEach(function(asset) {
    var filePath = asset.file.split('/');
    var fileName = filePath.pop();
    filePath = filePath.join('/')+'/';
    
    if (asset.type === 'mesh') {
      tasks[asset.name] = assetManager.addMeshTask(asset.name+' loader', asset.name,filePath,fileName);
      tasks[asset.name].onSuccess = function(t) {
        engine.loadingUIText = asset.name+' loaded';
        t.loadedMeshes[0].setEnabled(ENABLED);
        t.loadedMeshes[0].scaling = new BABYLON.Vector3(scale,scale,scale);
        createdAssets[asset.name] = t.loadedMeshes[0];
      };
      tasks[asset.name].onError = function(t) {
        engine.loadingUIText = 'Error during '+t.name;
      };
    }

    if (asset.type === 'sound') {
      tasks[asset.name] = assetManager.addBinaryFileTask(asset.name+' loader', filePath+fileName);
      tasks[asset.name].onSuccess = function(t) {
        engine.loadingUIText = asset.name+' loaded';
        createdAssets[asset.name] = new BABYLON.Sound(asset.name,t.data,scene,null);
      };
      tasks[asset.name].onError = function(t) {
        engine.loadingUIText = 'Error during '+t.name;
      };
    }
  });

  assetManager.onFinish = function(t) {
    callback(createdAssets);
  };

  assetManager.load();

}

