/* lapReporter.js
 *
 * Displays lap info on billboard plane
 *
 * TODO: attach to player? duh
 *       play with settings
 *       animate display on lap?
 *       GET LAP LENGTH
 */

function reportLap(current_lap,scene) {
  var lapReportPlane = BABYLON.Mesh.CreatePlane("lapReportPlane", 25, scene, false);
  lapReportPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
  lapReportPlane.material = new BABYLON.StandardMaterial("lapReportPlane", scene);
  lapReportPlane.position = new BABYLON.Vector3(camera.position.x,camera.position.y+5,camera.position.z);
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

