
var createMaterials = function(){
  window.materials = {};  
  // var roboShader = new BABYLON.ShaderMaterial("toon", scene, "robot", {});
  // roboShader.setTexture("textureSampler", mainTexture);
  createShader(new BABYLON.Texture("assets/robotTexture_1.png",scene), "robot1")
  createShader(new BABYLON.Texture("assets/robotTexture_2.png",scene), "robot2")
  createShader(new BABYLON.Texture("assets/robotTexture_3.png",scene), "robot3")
  createShader(new BABYLON.Texture("assets/robotTexture_4.png",scene), "robot4")
};

var createShader = function(texture,id) {
  var roboShader = new BABYLON.StandardMaterial('robotTex',scene);
  roboShader.diffuseTexture = texture;
  roboShader.specularPower = 100;
  roboShader.specularColor = new BABYLON.Color3(0,0,0);
  window.materials[""+id] = roboShader; 
}
