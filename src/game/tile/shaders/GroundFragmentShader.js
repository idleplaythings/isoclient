const GroundFragmentShader = `
    #extension GL_OES_standard_derivatives : enable

    uniform sampler2D groundTexture;
    uniform sampler2D propMap;
    uniform float size;
    varying vec2 vUv;

    vec2 cropUv() {

        float groundSize = size + 2.0;
        float groundTileSize = 1.0 / groundSize;
        
        return vec2(
            vUv.x * (1.0 - (groundTileSize * 2.0)) + groundTileSize,
            vUv.y * (1.0 - (groundTileSize * 2.0)) + groundTileSize
        );
   
    }

    float getPropNumber() {
        vec2 propUv = cropUv();

        vec4 propDetails = texture2D(propMap, propUv);

        return propDetails.a * 255.0;
    }

    vec4 sampleGroundTexture(float number){

        
        float textureAmount = 8.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - (vUv.y / textureAmount + tPos.y));

        return texture2D(groundTexture, finalPos);
    }

    void main() {

        float visual = getPropNumber();
        gl_FragColor = sampleGroundTexture(visual);
    }
`;

export default GroundFragmentShader;
