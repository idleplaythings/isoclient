const CubeTileFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    varying vec2 vUv;
    varying float vOpacity;
    varying float vTextureNumber;

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }

        float textureAmount = 8.0;
        float currentTexture = 8.0;
        vec2 tPos = vec2((mod(vTextureNumber, textureAmount) * (1.0 / textureAmount)), (floor(vTextureNumber / textureAmount) * (1.0 / textureAmount)));

        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - ((1.0 - vUv.y) / textureAmount + tPos.y));

        gl_FragColor = texture2D( map, finalPos );
    }
`;

export default CubeTileFragmentShader;
