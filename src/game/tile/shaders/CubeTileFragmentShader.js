const CubeTileFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber1;
    varying vec4 vTextureNumber2;
    varying vec3 vType;

    float isFlipped() {
        if (vType.z > 0.0) {
            return 1.0;
        } else {
            return 0.0;
        }
    }

    vec4 sampleTexture(float number) {

        if (number < 1.0) {
            return vec4(0,0,0,0);
        }
        
        float y = vUv.y;
        if (isFlipped() == 1.0) {
            y = 1.0 - vUv.y;
        }

        float textureAmount = 16.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - (y / textureAmount + tPos.y));

        return texture2D( map, finalPos );
    }

    vec4 sampleGuide(float number, float guideColor) {
        vec4 color = sampleTexture(number);
        color.rgb *= guideColor;
        return color;
    }

    vec4 combineColorByAlpha(vec4 colorA, vec4 colorB) {

        if (colorA.a == 0.0) {
            return colorB;
        }

        if (colorB.a == 0.0) {
            return colorA;
        }

        vec4 finalColor = mix(colorA, colorB, colorB.a);

        return finalColor;
    }

    vec4 combineTextureToColor(vec4 color, float textureNumber) {

        if (textureNumber < 1.0) {
            return color;
        }

        return combineColorByAlpha(color, sampleTexture(textureNumber));
    }

    vec4 applyShadowAndHighligh(vec4 color, vec4 guideColor, float shadowTextureNumber) {
        vec4 lightColor = vec4(1, 0.83, 0.56, 1);

        if (guideColor.g > 0.0) {  
            color.rgb += lightColor.rgb * guideColor.g * 0.2;
          
        } 
        
        if (shadowTextureNumber >= 0.0 && guideColor.r > 0.0) {
            vec4 shadowColor = sampleTexture(shadowTextureNumber);
            color.rgb -= (shadowColor.rgb + 1.0) * (shadowColor.a - guideColor.g * 0.8) * 0.2;
        }
        
        
        return color;
        
    }

    vec4 handleBrushed() {

        vec4 surfaceColor = vec4(0, 0, 0, 0);
        vec4 groundColor = vec4(0, 0, 0, 0);

        float surfaceTextureNumber = vTextureNumber1.x;
        float groundTextureNumber = vTextureNumber1.y;
        float shadowTextureNumber = vTextureNumber2.z;

        vec4 guideColor = combineColorByAlpha(sampleTexture(vTextureNumber2.x), sampleTexture(vTextureNumber2.y));

        if (guideColor.a == 0.0) {
            discard;
        }

        if (guideColor.r > 0.0) {
            surfaceColor = sampleGuide(surfaceTextureNumber, guideColor.r);
        } 

        if (guideColor.b > 0.0 ) {
            groundColor = sampleGuide(groundTextureNumber, guideColor.b);
        }

        float totalColor = guideColor.r + guideColor.b;

        vec4 finalColor = surfaceColor * guideColor.r / totalColor * surfaceColor.a + groundColor * guideColor.b / totalColor * groundColor.a;
        finalColor.a *= guideColor.a;

        if (finalColor.a == 0.0) {
            discard;
        }

        finalColor = applyShadowAndHighligh(finalColor, guideColor, shadowTextureNumber);
        
        return finalColor;
    }


    vec4 handleNormal() {

        vec4 color = sampleTexture(vTextureNumber1.r);
        color = combineTextureToColor(color, vTextureNumber1.g);
        color = combineTextureToColor(color, vTextureNumber1.b);
        color = combineTextureToColor(color, vTextureNumber1.a);

        return color;
    }

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }


        gl_FragColor = handleNormal();

        /*
        if (vType.x == 0.0) {
            gl_FragColor = handleNormal();
        } else if (vType.x == 1.0) {
            gl_FragColor = handleBrushed();
        } else {
            discard;
        }
        */
    }
`;

export default CubeTileFragmentShader;
