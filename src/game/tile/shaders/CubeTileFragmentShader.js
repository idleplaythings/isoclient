const CubeTileFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vTextureNumber;

    vec4 sampleTexture(float number) {
        
        float textureAmount = 16.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - ((1.0 - vUv.y) / textureAmount + tPos.y));

        return texture2D( map, finalPos );
    }

    vec4 sampleGuide(float number, float guideColor) {
        vec4 color = sampleTexture(number);
        color.rgb *= guideColor;
        return color;
    }

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }

        vec4 color = sampleTexture(vTextureNumber.x);
        vec4 colorA = vec4(0,0,0,0);
        vec4 colorB = vec4(0,0,0,0);

        if (color.a == 0.0) {
            discard;
        }

        if (color.r > 0.0) {
            colorA = sampleGuide(vTextureNumber.y, color.r);
        } 

        if (color.b > 0.0 ) {
            colorB = sampleGuide(1.0, 1.0);
        }

        float totalColor = color.r + color.b;

        vec4 finalColor = colorA * color.r / totalColor * colorA.a + colorB * color.b / totalColor * colorB.a;
        finalColor.a *= color.a;
        

        gl_FragColor = finalColor;
    }
`;

export default CubeTileFragmentShader;
