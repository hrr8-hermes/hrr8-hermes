var modUpdateFunction = function (particles) {
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
            if(this.colorArray){
                var pindex = Math.floor(particle.age / particle.lifeTime * this.colorArray.length);
                particle.color = this.colorArray[pindex];
            }
            if(this.growth){ 
                if(Array.isArray(this.growth)){
                    var gIndex = Math.floor(particle.age / particle.lifeTime * this.growth.length);
                    particle.color = this.colorArray[gIndex];
                }
                else{
                    particle.size += this._scaledUpdateSpeed * this.growth;
                }
            }
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

//Takes in an array of times and babylon colors, creates a gradient array from the result.
//Required by modUpdateFunction
/*
    [[0, new BABYLON.Color4()],
     [100, new BABYLON.Color4()]
    ]
*/
var makeColorGradient = function(array){
    var results = []; 
    for(var i = 0; i < array.length - 1; i++){
        var startTime = array[i][0]; 
        var startColor = array[i][1]; 
        var endTime = array[i+1][0];
        var endColor = array[i+1][1]; 
        var frames = endTime - startTime; 
        var colorStep = endColor.subtract(startColor);
        colorStep = colorStep.scale(1 / frames); 
        for(var j = 0; j < frames; j++){
            var colorAdd = colorStep.scale(j); 
            var resultColor = startColor.add(colorAdd);
            console.log(resultColor);
            results[j + startTime] = startColor.add(colorAdd); 
        }
    }
    return results; 
};

//Same as color array, but for floats
var makeFloatGradient = function(array){
    var results = []; 
    for(var i = 0; i < array.length - 1; i++){
        var startTime = array[i][0]; 
        var startSize = array[i][1]; 
        var endTime = array[i+1][0];
        var endSize = array[i+1][1]; 
        var frames = endTime - startTime; 
        var sizeStep = startSize - endSize; 
        sizeStep = sizeStep / frames; 
        for(var j = 0; j < frames; j++){
            var growthAdd = sizeStep * j; 
            results[j + startTime] = startSize + growthAdd; 
        }
    }
    return results; 
};