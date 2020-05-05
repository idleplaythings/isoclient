const WaterFragmentShader = `


    uniform float time;
    uniform sampler2D noise1;
    uniform sampler2D noise2;

    varying vec2 vUv;

    vec4 waterEffect() {
        float noise = texture2D( noise1, vUv - time * 0.000008 ).r + texture2D( noise2, vUv + time * 0.000008 ).r;

        vec4 waterColor = vec4(0.0, 0.18, 0.23, 0.6);
        vec4 higlightColor = vec4(1.0, 1.0, 1.0, 0.0);

        if (noise < 0.1) {
            return waterColor;
        }

        higlightColor.a = noise;
        float extraAlpha = 0.0;
        if (higlightColor.a > 0.5) {
            extraAlpha = (higlightColor.a - 0.5) * 2.0;
            higlightColor.a = (higlightColor.a - 0.5) * 10.0;
        } else if (higlightColor.a > 0.4) {
            //extraAlpha = - (higlightColor.a - 0.4) * 2.0;
            higlightColor.a = clamp((higlightColor.a - 0.4) * 2.0, 0.0, 0.3);
        } else {
            higlightColor.a = 0.0;
        }
        waterColor.rgb += higlightColor.rgb * higlightColor.a;
        //waterColor = combineColorByAlpha(waterColor, higlightColor); 
        
        waterColor.a += extraAlpha;
        
        
        
        return waterColor;
    }


/*
    vec4 handleWater() {
        float noise = texture2D( noiseMap1, vWaterUv - time * 0.05 ).r + texture2D( noiseMap2, vWaterUv + time * 0.05 ).r;
        
  
        vec4 waterColor = vec4(0.0, 0.18, 0.23, 0.6);
        vec4 higlightColor = vec4(1.0, 1.0, 1.0, 0.0);
        if (noise < 0.1) {
            return waterColor;
        }
        higlightColor.a = noise;
        float extraAlpha = 0.0;
        if (higlightColor.a > 0.5) {
            extraAlpha = (higlightColor.a - 0.5) * 2.0;
            higlightColor.a = (higlightColor.a - 0.5) * 10.0;
        } else if (higlightColor.a > 0.4) {
            //extraAlpha = - (higlightColor.a - 0.4) * 2.0;
            higlightColor.a = clamp((higlightColor.a - 0.4) * 2.0, 0.0, 0.3);
        } else {
            higlightColor.a = 0.0;
        }
        waterColor.rgb += higlightColor.rgb * higlightColor.a;
        //waterColor = combineColorByAlpha(waterColor, higlightColor); 
        
        waterColor.a += extraAlpha;
        
        
        
        return waterColor;
    
    }
    */

    void main() {
        gl_FragColor = waterEffect();
    }
`;

export default WaterFragmentShader;
