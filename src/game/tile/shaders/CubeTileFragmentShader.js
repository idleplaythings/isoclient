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

    vec4 combineTextureToColorWithBrush(vec4 color, float brushNumber, float textureNumber){

        if (textureNumber < 1.0 || brushNumber < 1.0) {
            return color;
        }

        vec4 textureColor = sampleTexture(textureNumber);
        float brushAlpha = sampleTexture(brushNumber).a;
        textureColor.a -= 1.0 - brushAlpha;

        if (textureColor.a <= 0.0) {
            return color;
        }

        return combineColorByAlpha(color, textureColor);
    }

    vec4 applyShadowAndHighligh(vec4 color, float shadowTextureNumber, float highlightTextureNumber) {

        float alpha = 0.0;

        if (shadowTextureNumber >= 1.0) {
            vec4 shadowColor = vec4(0.0, 0.0, 0.0, 1);
            vec4 guide = sampleTexture(shadowTextureNumber);

            color.rgb -= (shadowColor.rgb + 1.0) * guide.a * 0.1;
            alpha = guide.a;
        }

        if (highlightTextureNumber >= 1.0) {
            //vec4 lightColor = vec4(1, 0.83, 0.56, 1);
            
            vec4 lightColor = vec4(1, 1, 1, 1);
            vec4 guide = sampleTexture(highlightTextureNumber);

            color.rgb += lightColor.rgb * guide.a * 0.1;
            if (alpha < guide.a) {
                alpha = guide.a;
            }
        }
        
        if (highlightTextureNumber >= 1.0 || shadowTextureNumber >= 1.0) {
            color.a *= alpha;
        }

        return color;
        
    }
    
    vec4 handleNormal() {

        vec4 color = sampleTexture(vTextureNumber1.r);
        color = combineTextureToColor(color, vTextureNumber1.g);
        color = combineTextureToColor(color, vTextureNumber1.b);
        color = combineTextureToColor(color, vTextureNumber1.a);

        return color;
    }

    vec4 handleBrushed() {
        vec4 color = combineTextureToColorWithBrush(vec4(0.0), vTextureNumber2.x, vTextureNumber1.x);
        color = combineTextureToColorWithBrush(color, vTextureNumber2.y, vTextureNumber1.y);
        color = applyShadowAndHighligh(color, vTextureNumber2.b, vTextureNumber2.a);

        return color;
    }

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }

        if (vType.x == 1.0) {
            gl_FragColor = handleBrushed();
        } else {
            gl_FragColor = handleNormal();
        }
    }
`;

export default CubeTileFragmentShader;
