var expSettings = {}; 
window.vfx = {}; 
vfx.parts = {}; 
vfx.count = 0; 
expSettings.colorArray1 = [
    [0, new BABYLON.Color4(1, 0, 0, 1)],
    [40, new BABYLON.Color4(0.7, 0, 0, 1)],
    [60, new BABYLON.Color4(0.6, 0.3, 0, 0.7)],
    [100, new BABYLON.Color4(0.4, 0.1, 0, 0)]
];
expSettings.colorArray2 = [
    [0, new BABYLON.Color4(1, 1, 1, 1)],
    [40, new BABYLON.Color4(0.8, 0.2, 0, 1)],
    [60, new BABYLON.Color4(0, 0, 0, 0.9)],
    [100, new BABYLON.Color4(0, 0, 0, 0.0)]
];
expSettings.colorGradient1 = makeColorGradient(expSettings.colorArray1);
expSettings.colorGradient2 = makeColorGradient(expSettings.colorArray2); 

        
vfx.parts.makeSpray = function(emitter){
    // Create a particle system
    var spray = new BABYLON.ParticleSystem("sprayParticles" + vfx.count, 2000, scene);

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
    spray.minEmitBox = new BABYLON.Vector3(-0.2, -100.6, -0.2); // Starting all from
    spray.maxEmitBox = new BABYLON.Vector3(0.2, -100.6, 0.2); // To...
    spray.minSize = 0.1;
    spray.maxSize = 0.4;
    spray.direction1 = new BABYLON.Vector3(2, 1.5, 2);
    spray.direction2 = new BABYLON.Vector3(-2, 1.5, -2);

    // Angular speed, in radians
    spray.minAngularSpeed = -10;
    spray.maxAngularSpeed = -20;
    spray.gravity = new BABYLON.Vector3(0,-100,0);
    // Speed
    spray.minEmitPower = 300;
    spray.maxEmitPower = 300;
    spray.updateSpeed = 0.005;

    // Start the particle system
    spray.start();
    setTimeout(function(){spray.stop();}, 300);
    vfx.count++; 
};

vfx.parts.makeFireball = function(emitter){
    // Create a particle system
    fireball = new BABYLON.ParticleSystem("particles" + vfx.count, 2000, scene);

    fireball.particleTexture = new BABYLON.Texture("assets/Sprite_Smoke.png", scene);
    
    fireball.color1 = new BABYLON.Color4(1, 0.89, 0.69, 1);
    fireball.color2 = new BABYLON.Color4(0.65, 0.25, 0.12, 1);
    fireball.minLifeTime = 0.05;
    fireball.maxLifeTime = 0.3;
    fireball.manualEmitCount = 1000; 
    fireball.disposeOnStop = true; 
    fireball.blendMode = 1;
    
    fireball.emitter = emitter; // the starting object, the emitter
    fireball.minEmitBox = new BABYLON.Vector3(-0.2, -100.6, -0.2); // Starting all from
    fireball.maxEmitBox = new BABYLON.Vector3(0.2, -100.6, 0.2); // To...
    fireball.minSize = 1;
    fireball.maxSize = 2;
    fireball.direction1 = new BABYLON.Vector3(1, 8, 1);
    fireball.direction2 = new BABYLON.Vector3(-1, 8, -1);

    // Angular speed, in radians
    fireball.minAngularSpeed = -10;
    fireball.maxAngularSpeed = -20;

    // Speed
    fireball.minEmitPower = 100;
    fireball.maxEmitPower = 150;
    fireball.updateSpeed = 0.005;

    // Start the particle system
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
    fireball.start();
    setTimeout(function(){fireball.stop();}, 300);
    vfx.count++; 
};

vfx.parts.makeFlash = function(emitter){
    // Create a particle system
    flash = new BABYLON.ParticleSystem("flash" + vfx.count, 2000, scene);

    flash.particleTexture = new BABYLON.Texture("assets/square.png", scene);
    
    flash.color1 = new BABYLON.Color4(1, 1, 1, 0.5);
    flash.color2 = new BABYLON.Color4(1, 0, 0, 0.5);
    flash.colorDead = new BABYLON.Color4(1,0,0,0);
    flash.minLifeTime = 0.02;
    flash.maxLifeTime = 0.08;
    flash.manualEmitCount = 5000; 
    flash.disposeOnStop = true; 
    flash.blendMode = 1;
    
    flash.emitter = emitter; // the starting object, the emitter
    flash.minEmitBox = new BABYLON.Vector3(-0.2, -100.6, -0.2); // Starting all from
    flash.maxEmitBox = new BABYLON.Vector3(0.2, -100.6, 0.2); // To...
    flash.minSize = 0.1;
    flash.maxSize = 3;
    flash.direction1 = new BABYLON.Vector3(1, 0.6, 1);
    flash.direction2 = new BABYLON.Vector3(-1, 0.6, -1);

    // Angular speed, in radians
    flash.minAngularSpeed = -10;
    flash.maxAngularSpeed = -20;

    // Speed
    flash.minEmitPower = 100;
    flash.maxEmitPower = 3000;
    flash.updateSpeed = 0.005;
    flash.growth = 20;
    flash.updateFunction = function (particles) {
        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                particle.lifeIndex = undefined; 
                this.recycleParticle(particle);
                index--;
                continue;
            }
            else {
                particle.size += this._scaledUpdateSpeed * this.growth;
                if (particle.color.a < 0)
                    particle.color.a = 0;
                particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
                particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle.position.addInPlace(this._scaledDirection);
                this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                particle.direction.addInPlace(this._scaledGravity);
            }
        }
    };

    // Start the particle system
    flash.start();
    setTimeout(function(){flash.stop();}, 300);
    vfx.count++; 
};


vfx.parts.makeFlame = function(emitter, minSize, maxSize, color1, color2, colorEnd){
    // Create a particle system
    flame = new BABYLON.ParticleSystem("flame" + vfx.count, 2000, scene);

    flame.particleTexture = new BABYLON.Texture("assets/square.png", scene);
    
    flame.color1 = color1;
    flame.color2 = color2;
    flame.colorDead = colorEnd;
    flame.minLifeTime = 0.06;
    flame.maxLifeTime = 0.06;
    flame.emitRate = 120;
    flame.disposeOnStop = true; 
    flame.blendMode = 1;
    
    flame.emitter = emitter; // the starting object, the emitter
    flame.minEmitBox = new BABYLON.Vector3(1, 1, 1); // Starting all from
    flame.maxEmitBox = new BABYLON.Vector3(-1, -1, -1); // To...
    flame.minSize = minSize;
    flame.maxSize = maxSize;
    flame.direction1 = new BABYLON.Vector3(0, -1, 0);
    flame.direction2 = new BABYLON.Vector3(0, -1, 0);

    // Angular speed, in radians
    flame.minAngularSpeed = -10;
    flame.maxAngularSpeed = -20;

    // Speed
    flame.minEmitPower = 400;
    flame.maxEmitPower = 500;
    flame.updateSpeed = 0.005;

    flame.updateFunction = function (particles) {
        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            particle.age += this._scaledUpdateSpeed;
            if(!particle.origin){
                particle.origin = new BABYLON.Vector3(0,0,0);
            }
            if (particle.age >= particle.lifeTime) {
                this.recycleParticle(particle);
                index--;
                particle.origin = undefined; 
                continue;
            }
            else {
                particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
                particle.color.addInPlace(this._scaledColorStep);
                if (particle.color.a < 0)
                    particle.color.a = 0;
                particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
                particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle.origin.addInPlace(this._scaledDirection);
                particle.position = particle.origin.add(this.emitter.getAbsolutePosition());
                // this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                // particle.direction.addInPlace(this._scaledGravity);
            }
        }
    };
    // Start the particle system
    flame.start();
    vfx.count++; 
    return flame; 
};


vfx.parts.makeGreenInnerFlash = function(emitter){
    // Create a particle system
    greenFlash = new BABYLON.ParticleSystem("greenFlash" + vfx.count, 2000, scene);

    greenFlash.particleTexture = new BABYLON.Texture("assets/square.png", scene);
    
    greenFlash.color1 = new BABYLON.Color4(0, 1, 0, 0.5);
    greenFlash.color2 = new BABYLON.Color4(0.2, 1, 0.2, 0.5);
    greenFlash.colorDead = new BABYLON.Color4(0,1,0,0);
    greenFlash.minLifeTime = 0.05;
    greenFlash.maxLifeTime = 0.2;
    greenFlash.manualEmitCount = 2000; 
    greenFlash.disposeOnStop = true; 
    greenFlash.blendMode = 1;
    
    greenFlash.emitter = emitter; // the starting object, the emitter
    greenFlash.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
    greenFlash.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...
    greenFlash.minSize = 1;
    greenFlash.maxSize = 2;
    greenFlash.direction1 = new BABYLON.Vector3(1, 0.2, 1);
    greenFlash.direction2 = new BABYLON.Vector3(-1, 0.2, -1);

    // Angular speed, in radians
    greenFlash.minAngularSpeed = -10;
    greenFlash.maxAngularSpeed = -20;

    // Speed
    greenFlash.minEmitPower = 40;
    greenFlash.maxEmitPower = 120;
    greenFlash.updateSpeed = 0.005;
    greenFlash.growth = 20;
    // greenFlash.updateFunction = function (particles) {
    //     for (var index = 0; index < particles.length; index++) {
    //         var particle = particles[index];
    //         particle.age += this._scaledUpdateSpeed;
    //         if (particle.age >= particle.lifeTime) {
    //             particle.lifeIndex = undefined; 
    //             this.recycleParticle(particle);
    //             index--;
    //             continue;
    //         }
    //         else {
    //             particle.size += this._scaledUpdateSpeed * this.growth;
    //             if (particle.color.a < 0)
    //                 particle.color.a = 0;
    //             particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
    //             particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
    //             particle.position.addInPlace(this._scaledDirection);
    //             this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
    //             particle.direction.addInPlace(this._scaledGravity);
    //         }
    //     }
    // };

    // Start the particle system
    greenFlash.start();
    setTimeout(function(){greenFlash.stop();}, 0);
    vfx.count++;
};

vfx.parts.makeEnergyBall = function(emitter, color1, color2, colorEnd, sizeMin, sizeMax){
    // Create a particle system
    energyBall = new BABYLON.ParticleSystem("energyBall" + vfx.count, 2000, scene);

    energyBall.particleTexture = new BABYLON.Texture("assets/square.png", scene);
    
    energyBall.color1 = color1;
    energyBall.color2 = color2;
    energyBall.colorDead = colorEnd;
    energyBall.minLifeTime = 0.1;
    energyBall.maxLifeTime = 0.2;
    energyBall.manualEmitCount = 50; 
    energyBall.disposeOnStop = true; 
    energyBall.blendMode = 1;
    
    energyBall.emitter = emitter; // the starting object, the emitter
    energyBall.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
    energyBall.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...
    energyBall.minSize = sizeMin;
    energyBall.maxSize = sizeMax;
    energyBall.direction1 = new BABYLON.Vector3(0.2, 1, 0.2);
    energyBall.direction2 = new BABYLON.Vector3(-0.2, 1, -0.2);

    // Angular speed, in radians
    energyBall.minAngularSpeed = -10;
    energyBall.maxAngularSpeed = -20;

    // Speed
    energyBall.minEmitPower = 40;
    energyBall.maxEmitPower = 120;
    energyBall.updateSpeed = 0.005;
    energyBall.growth = 20;
    // energyBall.updateFunction = function (particles) {
    //     for (var index = 0; index < particles.length; index++) {
    //         var particle = particles[index];
    //         particle.age += this._scaledUpdateSpeed;
    //         if (particle.age >= particle.lifeTime) {
    //             particle.lifeIndex = undefined; 
    //             this.recycleParticle(particle);
    //             index--;
    //             continue;
    //         }
    //         else {
    //             particle.size += this._scaledUpdateSpeed * this.growth;
    //             if (particle.color.a < 0)
    //                 particle.color.a = 0;
    //             particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
    //             particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
    //             particle.position.addInPlace(this._scaledDirection);
    //             this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
    //             particle.direction.addInPlace(this._scaledGravity);
    //         }
    //     }
    // };

    // Start the particle system
    energyBall.start();
    setTimeout(function(){energyBall.stop();}, 300);
    vfx.count++;
};

//Compile effect parts

vfx.explosion = function(emitter){
   // emitter = emitter.position.add(new BABYLON.Vector3(0,-1.7,0)); 
    
    vfx.parts.makeFlash(emitter);
    setTimeout(function(){
        vfx.parts.makeFireball(emitter);
        vfx.parts.makeSpray(emitter);
    },100);
};

vfx.boost = function(emitter){
    var boosts = []; 
    boosts.push(vfx.parts.makeFlame(emitter, 0.4, 0.5,
     new BABYLON.Color4(1,0.8,0,1), new BABYLON.Color4(1,0.2,0,1), new BABYLON.Color4(1,0,0,0)));
    boosts.push(vfx.parts.makeFlame(emitter, 0.2, 0.3,
     new BABYLON.Color4(1,1,1,1), new BABYLON.Color4(1,1,1,1), new BABYLON.Color4(0.8,0,0,0)));
    return boosts; 
};

vfx.attack = function(emitter){
    console.log("attacking");
    vfx.parts.makeGreenInnerFlash(emitter); 
    vfx.parts.makeEnergyBall(emitter, new BABYLON.Color4(0,1,1,1), new BABYLON.Color4(1,1,1,1), new BABYLON.Color4(0,1,0.5,0),
    0.5, 2);
};
