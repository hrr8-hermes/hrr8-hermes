
var createMaterials = function(){
  window.materials = {}; 
  var mainTexture = new BABYLON.Texture("assets/robotTexture.png",scene);  
  // var roboShader = new BABYLON.ShaderMaterial("toon", scene, "robot", {});
  // roboShader.setTexture("textureSampler", mainTexture);
  var roboShader = new BABYLON.StandardMaterial('robotTex',scene);
  roboShader.diffuseTexture = mainTexture;
  roboShader.specularPower = 100;
  roboShader.specularColor = new BABYLON.Color3(0,0,0);
  window.materials.robot = roboShader; 
};
