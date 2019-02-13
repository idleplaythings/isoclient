const CubeTileFragmentShader = `
    precision highp float;
    varying vec2 vUv;
    varying float vOpacity;

    void main() {

        if (vOpacity < 1.0) {
            discard;
        }

        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
`;

export default CubeTileFragmentShader;
