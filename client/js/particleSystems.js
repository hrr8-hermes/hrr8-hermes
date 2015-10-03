var expSettings = {}; 
window.vfx = {}; 
vfx.parts = {}; 
expSettings.colorArray1 = [
    [0, new BABYLON.Color4(1, 0.9, 0.5, 0.7)],
    [40, new BABYLON.Color4(0.7, 0.5, 0.2, 0.7)],
    [60, new BABYLON.Color4(0.6, 0.3, 0, 0.7)],
    [100, new BABYLON.Color4(0.4, 0.1, 0, 0)]
];
expSettings.colorArray2 = [
    [0, new BABYLON.Color4(1, 1, 1, 0.6)],
    [40, new BABYLON.Color4(0.8, 0.2, 0, 0.6)],
    [60, new BABYLON.Color4(0, 0, 0, 0.9)],
    [100, new BABYLON.Color4(0, 0, 0, 0.0)]
];
expSettings.colorGradient1 = makeColorGradient(expSettings.colorArray1);
expSettings.colorGradient2 = makeColorGradient(expSettings.colorArray2); 

        
vfx.parts.makeSpray = function(emitter){
    // Create a particle system
    var spray = new BABYLON.ParticleSystem("sprayParticles", 2000, scene);

    spray.particleTexture = new BABYLON.Texture("assets/Sprite_Smoke.png", scene);
    
    spray.color1 = new BABYLON.Color4(1, 1, 1, 1);
    spray.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    spray.colorDead = new BABYLON.Color4(1,1,1,0);
    spray.minLifeTime = 0.05;
    spray.maxLifeTime = 0.3;
    spray.emitRate = 500; 
    spray.disposeOnStop = true; 
    spray.blendMode = 1;
    
    spray.emitter = emitter; // the starting object, the emitter
    spray.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2); // Starting all from
    spray.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2); // To...
    spray.minSize = 0.1;
    spray.maxSize = 0.4;
    spray.direction1 = new BABYLON.Vector3(2, 3, 2);
    spray.direction2 = new BABYLON.Vector3(-2, 3, -2);

    // Angular speed, in radians
    spray.minAngularSpeed = -10;
    spray.maxAngularSpeed = -20;
    spray.gravity = new BABYLON.Vector3(0,-500,0);
    // Speed
    spray.minEmitPower = 10;
    spray.maxEmitPower = 20;
    spray.updateSpeed = 0.005;

    // Start the particle system
    spray.start();
    setTimeout(function(){spray.stop();}, 300);
};

vfx.parts.makeFireball = function(emitter){
    console.log('making explosion');
    // Create a particle system
    fireball = new BABYLON.ParticleSystem("particles", 2000, scene);

    fireball.particleTexture = new BABYLON.Texture("assets/Sprite_Smoke.png", scene);
    
    fireball.color1 = new BABYLON.Color4(1, 0.89, 0.69, 1);
    fireball.color2 = new BABYLON.Color4(0.65, 0.25, 0.12, 1);
    fireball.minLifeTime = 0.05;
    fireball.maxLifeTime = 0.3;
    fireball.manualEmitCount = 2000; 
    fireball.disposeOnStop = true; 
    fireball.blendMode = 1;
    
    fireball.emitter = emitter; // the starting object, the emitter
    fireball.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2); // Starting all from
    fireball.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2); // To...
    fireball.minSize = 0.1;
    fireball.maxSize = 0.4;
    fireball.direction1 = new BABYLON.Vector3(1, 8, 1);
    fireball.direction2 = new BABYLON.Vector3(-1, 8, -1);

    // Angular speed, in radians
    fireball.minAngularSpeed = -10;
    fireball.maxAngularSpeed = -20;

    // Speed
    fireball.minEmitPower = 4;
    fireball.maxEmitPower = 10;
    fireball.updateSpeed = 0.005;

    // Start the particle system
    fireball.start();
    fireball.updateFunction = function (particles) {
        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            if(!particle.rand || particle.age === 0 ){
                particle.rand = Math.random(); 
            }
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                particle.lifeIndex = undefined; 
                this.recycleParticle(particle);
                index--;
                continue;
            }
            else {
                particle.size += this._scaledUpdateSpeed * 15;
                var pindex = Math.floor(particle.age / particle.lifeTime * expSettings.colorGradient1.length);
                //particle.color = psColors[pindex]; 
                BABYLON.Color4.LerpToRef(expSettings.colorGradient1[pindex], expSettings.colorGradient2[pindex], particle.rand, particle.color);
                if (particle.color.a < 0)
                    particle.color.a = 0;
                particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
                particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle.position.addInPlace(this._scaledDirection);
                this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                particle.direction.addInPlace(this._scaledGravity);
                particle.size += particle.size * 5 * this._scaledUpdateSpeed;  
            }
        }
    };
    setTimeout(function(){fireball.stop();}, 300);
};

vfx.explosion = function(emitter){
    vfx.parts.makeFireball(emitter);
    vfx.parts.makeSpray(emitter);
};

vfx.test = 5;