/* lapReporter.js
 *
 * Displays lap info on billboard plane
 *
 * TODO: attach to player? duh
 *       play with settings
 *       animate display on lap?
 *       GET LAP LENGTH
 */

function reportLap(distance,scene) {
  $HUD = document.getElementById('hud');
  if (!$HUD) {
    var $HUD = document.createElement('div');
    $HUD.setAttribute('id','hud');
    $HUD.style.position = 'fixed';
    $HUD.style.top = '10px';
    $HUD.style.width = '80%';
    $HUD.style.height = '35px';
    $HUD.style.right = '0';
    $HUD.style.font = '24px bold ariel, sans-serif';
    $HUD.style.color = 'white';
    var $lap = document.createElement('div');
    $lap.setAttribute('id','laphud');
    $lap.style.float = 'left';
    var $timer = document.createElement('div');
    window.raceTimer = new stopWatch();
    $timer.style.marginRight = '10px';
    $timer.style.float = 'right';
    $timer.textContent = '0:0:0';
    document.body.appendChild($HUD);
    $HUD.appendChild($lap);
    $HUD.appendChild($timer);
    raceTimer.start();
    window.timerInterval = setInterval(function() { $timer.textContent = raceTimer.time(); },1);
  }
  var $lap = document.getElementById('laphud');
  var current_lap = 1+(distance/LAP_DIST)|0;
  if (current_lap>NUM_LAPS) {
    raceTimer.stop();
    clearInterval(timerInterval);
    current_lap = 'FINISHED';
  }
  $lap.textContent = 'Lap: '+current_lap;

  /* 
   * kept for historical purposes, in case we want to add a native 3d effect
   *
  var lapReportPlane = BABYLON.Mesh.CreatePlane("lapReportPlane", 25, scene, false);
  lapReportPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  lapReportPlane.material = new BABYLON.StandardMaterial("lapReportPlane", scene);
  lapReportPlane.parent = camera;
  //lapReportPlane.position = new BABYLON.Vector3(0,5,20);
  lapReportPlane.scaling.y = 0.4;
  var lapReportPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
  lapReportPlane.material.diffuseTexture = lapReportPlaneTexture;
  lapReportPlane.material.specularColor = new BABYLON.Color3(0, 0, 0);
  lapReportPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  lapReportPlane.material.backFaceCulling = false;
  lapReportPlaneTexture.drawText("Lap: "+current_lap, null, 140, "bold 140px verdana", "white", "#0000AA");
  /*
  var context2D = lapReportPlaneTexture.getContext();
  context2D.clearRect(0, 200, 512, 512);
  lapReportPlaneTexture.drawText(data, null, 380, "140px verdana", "white", null);
  */
}

// thanks to a gist I lost the link to
function stopWatch() {
  var startAt = 0;
  var lapTime = 0;

  var now = function() {
    return (new Date()).getTime();
  };

  this.start = function() {
    startAt = startAt ? startAt : now();
  };
  this.stop = function() {
    lapTime = startAt ? lapTime + now()-startAt : lapTime;
    startAt = 0;
  };
  this.reset = function() {
    lapTime = startAt = 0;
  };
  this.time = function() {
    var t = lapTime + (startAt?now() - startAt:0);
    var h = m = s = ms = 0;
    h = (t/(60*60*1000))|0;
    t = t % (60*60*1000);
    m = (t/(60*1000))|0;
    t = t % (60*1000);
    s = (t/1000)|0;
    ms = t%1000;
    return m+':'+s+':'+ms;
  };
};
