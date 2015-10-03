precision highp float;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

// Refs
uniform sampler2D textureSampler;

void main(void) {
    float ToonThresholds[4];
    ToonThresholds[0] = 0.90;
    ToonThresholds[1] = 0.5;
    
    float ToonBrightnessLevels[5];
    ToonBrightnessLevels[0] = 1.0;
    ToonBrightnessLevels[1] = 0.7;
    ToonBrightnessLevels[2] = 0.5;
    
    vec3 vLightPosition = vec3(0,0,0);
    
    // Light
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
    
    // diffuse
    float ndl = max(0., dot(vNormalW, lightVectorW));
    
    vec3 color = texture2D(textureSampler, vUV).rgb;
    
    if (ndl > ToonThresholds[0])
    {
        color *= ToonBrightnessLevels[0];
    }
    else if (ndl > ToonThresholds[1])
    {
        color *= ToonBrightnessLevels[1];
    }
    else
    {
        color *= ToonBrightnessLevels[2];
    }
    
    gl_FragColor = vec4(color, 1.);
}